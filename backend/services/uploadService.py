import uuid
import tempfile
import os
import wntr
import asyncio
from fastapi import UploadFile, HTTPException

# NEW IMPORTS
from store.networkStore import networks
from services.measurementService import generate_measured_data


async def process_epanet_upload(file: UploadFile):
    # ================= VALIDATION =================
    if not file.filename.endswith(".inp"):
        raise HTTPException(
            status_code=400,
            detail="Only .inp files are supported"
        )

    # ================= SAVE FILE SAFELY =================
    with tempfile.NamedTemporaryFile(delete=False, suffix=".inp") as f:
        while chunk := await file.read(1024 * 1024):
            f.write(chunk)
        inp_path = f.name

    try:
        # ================= LOAD NETWORK =================
        try:
            wn = wntr.network.WaterNetworkModel(inp_path)
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Invalid EPANET file"
            )

        # ================= TIME SETTINGS =================
        wn.options.time.hydraulic_timestep = 3600
        wn.options.time.report_timestep = 3600
        wn.options.time.pattern_timestep = 3600
        wn.options.time.duration = 24 * 3600

        # ================= RUN SIMULATION (ASYNC SAFE) =================
        sim = wntr.sim.EpanetSimulator(wn)
        results = await asyncio.to_thread(sim.run_sim)

        pressure_df = results.node["pressure"]

        # ================= PRESSURE (24 HOURS) =================
        pressures = {
            int(t // 3600): pressure_df.loc[t].to_dict()
            for t in pressure_df.index
        }

        # ================= NODES =================
        nodes = []
        for name, node in wn.nodes():
            coord = node.coordinates or (0, 0)

            node_data = {
                "id": name,
                "type": node.node_type.lower(),
                "x": coord[0],
                "y": coord[1],
            }

            node_type = node.node_type.lower()

            if node_type == "junction":
                node_data.update({
                    "elevation": node.elevation,
                    "base_demand": node.base_demand,
                })

            elif node_type == "tank":
                node_data.update({
                    "elevation": node.elevation,
                    "init_level": node.init_level,
                    "min_level": node.min_level,
                    "max_level": node.max_level,
                    "diameter": node.diameter,
                })

            elif node_type == "reservoir":
                node_data.update({
                    "head": node.head,
                })

            nodes.append(node_data)

        # ================= EDGES =================
        edges = []
        for name, link in wn.links():
            link_type = link.link_type.lower()

            link_data = {
                "id": name,
                "source": link.start_node_name,
                "target": link.end_node_name,
                "type": link_type,
            }

            if link_type == "pipe":
                link_data.update({
                    "length": link.length,
                    "diameter": link.diameter,
                    "roughness": link.roughness,
                    "loss_coeff": link.minor_loss,
                    "status": str(link.initial_status),
                })

            elif link_type == "pump":
                link_data.update({
                    "pump_curve": link.pump_curve_name,
                    "status": str(link.initial_status),
                })

            edges.append(link_data)

        # ================= BUILD NETWORK OBJECT =================
        network_data = {
            "id": str(uuid.uuid4()),
            "name": file.filename,
            "nodes": nodes,
            "edges": edges,
            "pressures": pressures,
            "measured_pressures": {},  # will be filled next
        }

        # ================= GENERATE MEASURED DATA =================
        generate_measured_data(network_data)

        # ================= STORE NETWORK =================
        networks.append(network_data)

        return network_data

    finally:
        # ================= CLEANUP =================
        if os.path.exists(inp_path):
            os.remove(inp_path)