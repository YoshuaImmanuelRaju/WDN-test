import random
import math


def distance(a, b):
    return math.sqrt((a["x"] - b["x"])**2 + (a["y"] - b["y"])**2)


def run_leach(params):
    nodes = []
    for i in range(params.numNodes):
        nodes.append({
            "id": i,
            "x": random.uniform(0, params.areaX),
            "y": random.uniform(0, params.areaY),
            "energy": params.initialEnergy,
            "lastCHRound": -1
        })

    sink = {"x": params.sinkX, "y": params.sinkY}
    rounds = []

    for r in range(params.maxRounds):

        cluster_heads = []
        communications = []

        # --- Cluster Head Selection ---
        for node in nodes:
            if node["energy"] <= 0:
                continue

            if random.random() < params.clusterHeadProbability:
                cluster_heads.append(node["id"])
                node["lastCHRound"] = r

        if not cluster_heads:
            continue

        # --- Cluster Formation ---
        for node in nodes:
            if node["energy"] <= 0:
                continue

            if node["id"] in cluster_heads:
                # CH sends to sink
                communications.append({
                    "from": node["id"],
                    "to": "sink"
                })

                # Energy drain
                node["energy"] -= 0.02

            else:
                # join nearest CH
                nearest = min(
                    cluster_heads,
                    key=lambda ch: distance(
                        node,
                        next(n for n in nodes if n["id"] == ch)
                    )
                )

                communications.append({
                    "from": node["id"],
                    "to": nearest
                })

                node["energy"] -= 0.01

        rounds.append({
            "round": r,
            "clusterHeads": cluster_heads,
            "communications": communications,
            "energy": {n["id"]: n["energy"] for n in nodes}
        })

    return {
        "nodes": [{"id": n["id"], "x": n["x"], "y": n["y"]} for n in nodes],
        "sink": sink,
        "rounds": rounds
    }