import random

def generate_measured_data(network):
    pressures = network.get("pressures", {})
    measured = {}

    for hour, nodes in pressures.items():
        measured[hour] = {}

        h = int(hour)

        for node_id, value in nodes.items():
            base = value

            # 🔹 Daily pattern
            if 6 <= h <= 9:
                base *= random.uniform(0.85, 0.95)
            elif 18 <= h <= 21:
                base *= random.uniform(0.80, 0.92)
            else:
                base *= random.uniform(0.95, 1.05)

            # 🔹 Noise
            noise = random.uniform(-3, 3)

            # 🔹 Drift
            drift = random.uniform(-1.5, 1.5)

            # 🔹 Rare anomaly
            anomaly = random.uniform(-8, 8) if random.random() < 0.05 else 0

            measured_value = base + noise + drift + anomaly

            measured[hour][node_id] = round(measured_value, 2)

    network["measured_pressures"] = measured
