from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import SimulationRequest, SimulationResponse
from leach import run_leach

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest):
    result = run_leach(request)
    return result