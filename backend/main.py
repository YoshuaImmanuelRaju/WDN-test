from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uuid
import random

# 🔥 NEW IMPORTS FOR LEACH
from models import SimulationRequest, SimulationResponse
from leach import run_leach

app = FastAPI()

# ✅ CORS for Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # keep your original
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ UTILITIES ------------------

def auto_layout(nodes):
    spacing = 150
    for i, n in enumerate(nodes):
        if n["x"] == 0 and n["y"] == 0:
            n["x"] = (i % 5) * spacing
            n["y"] = (i // 5) * spacing

def generate_alerts(nodes):
    alerts = []
    for n in nodes:
        if n["type"] == "junction":
            pressure = random.randint(5, 90)
            if pressure < 10 or pressure > 80:
                alerts.append({
                    "id": f"alert-{n['id']}",
                    "location": [n["id"]],
                    "acknowledged": False,
                    "pressure": pressure,
                })
    return alerts

# ------------------ EPANET PARSER ------------------

def parse_inp(content: str):
    section = None
    junctions, reservoirs, tanks = {}, {}, {}
    pipes, pumps, valves = {}, {}, {}
    coordinates = {}

    for line in content.splitlines():
        line = line.strip()
        if not line or line.startswith(";"):
            continue

        if line.startswith("[") and line.endswith("]"):
            section = line
            continue

        parts = line.split()

        if section == "[JUNCTIONS]":
            junctions[parts[0]] = {
                "id": parts[0],
                "type": "junction",
                "demand": float(parts[2]),
            }

        elif section == "[RESERVOIRS]":
            reservoirs[parts[0]] = {
                "id": parts[0],
                "type": "reservoir",
            }

        elif section == "[TANKS]":
            tanks[parts[0]] = {
                "id": parts[0],
                "type": "tank",
            }

        elif section == "[PIPES]":
            pipes[parts[0]] = {
                "id": parts[0],
                "source": parts[1],
                "target": parts[2],
                "diameter": float(parts[4]),
                "type": "pipe",
            }

        elif section == "[PUMPS]":
            pumps[parts[0]] = {
                "id": f"pump-{parts[0]}",
                "source": parts[1],
                "target": parts[2],
                "type": "pump",
            }

        elif section == "[VALVES]":
            valves[parts[0]] = {
                "id": f"valve-{parts[0]}",
                "source": parts[1],
                "target": parts[2],
                "type": "valve",
            }

        elif section == "[COORDINATES]":
            coordinates[parts[0]] = {
                "x": float(parts[1]) * 10,
                "y": float(parts[2]) * 10,
            }

    nodes = []
    for group in (junctions, reservoirs, tanks):
        for n in group.values():
            coord = coordinates.get(n["id"], {"x": 0, "y": 0})
            nodes.append({
                **n,
                "x": coord["x"],
                "y": coord["y"],
            })

    auto_layout(nodes)

    edges = []
    edges.extend(pipes.values())
    edges.extend(pumps.values())
    edges.extend(valves.values())

    alerts = generate_alerts(nodes)

    return {
        "id": str(uuid.uuid4()),
        "name": "EPANET Network",
        "nodes": nodes,
        "edges": edges,
        "alerts": alerts,
    }

# ------------------ EPANET ROUTES ------------------

@app.post("/networks/upload")
async def upload_network(file: UploadFile = File(...)):
    content = (await file.read()).decode("utf-8")

    if not file.filename.endswith(".inp"):
        return {"error": "Only .inp supported"}

    return parse_inp(content)

@app.patch("/networks/{network_id}/junctions/{junction_id}")
async def update_demand(network_id: str, junction_id: str, demand: float):
    return {
        "junctionId": junction_id,
        "updatedDemand": demand,
        "status": "ok"
    }

# ------------------ 🔥 LEACH SIMULATION ROUTE ------------------

@app.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest):
    result = run_leach(request)
    return result