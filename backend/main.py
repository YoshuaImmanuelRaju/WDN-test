# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import epanetRouter
from scheduler.scheduler import start_scheduler

app = FastAPI(
    title="EPANET Simulator API",
    description="Backend for water network simulation and monitoring",
    version="1.0.0"
)

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # "http://localhost:5173",
        "https://wdn-test.vercel.app/"
    ],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ROOT =================
@app.get("/")
def read_root():
    return {"message": "EPANET API running 🚀"}

# ================= ROUTERS =================
app.include_router(epanetRouter.router)

# ================= STARTUP =================
@app.on_event("startup")
def startup_event():
    print("🚀 Server started")
    print("⏳ Starting scheduler...")
    start_scheduler()

# ================= SHUTDOWN =================
@app.on_event("shutdown")
def shutdown_event():
    print("🛑 Server shutting down")