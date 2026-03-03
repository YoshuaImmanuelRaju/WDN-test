from pydantic import BaseModel
from typing import List, Dict, Union


class SimulationRequest(BaseModel):
    numNodes: int
    areaX: float
    areaY: float
    initialEnergy: float
    clusterHeadProbability: float
    packetSize: int
    maxRounds: int
    sinkX: float
    sinkY: float


class NodeOut(BaseModel):
    id: int
    x: float
    y: float


class RoundOut(BaseModel):
    round: int
    clusterHeads: List[int]
    communications: List[Dict[str, Union[int, str]]]
    energy: Dict[int, float]


class SimulationResponse(BaseModel):
    nodes: List[NodeOut]
    sink: Dict[str, float]
    rounds: List[RoundOut]