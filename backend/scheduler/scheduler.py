# scheduler/scheduler.py

from apscheduler.schedulers.background import BackgroundScheduler
from services.measurementService import generate_measured_data
from store.networkStore import networks


scheduler = BackgroundScheduler()


def update_all_networks():
    print("🔄 Updating measured data...")

    for network in networks:
        generate_measured_data(network)


def start_scheduler():
    scheduler.add_job(update_all_networks, "interval", minutes=5)
    scheduler.start()