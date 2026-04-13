import random

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from store import agents, save_agents

router = APIRouter()

TASKS = [
    "cooking",
    "baking",
    "reading",
    "playing tennis",
    "gardening",
    "painting",
    "fishing",
    "napping",
    "doing yoga",
    "playing chess",
    "knitting",
    "stargazing",
    "skateboarding",
    "juggling",
    "meditating",
]


class AgentCreate(BaseModel):
    owner: str
    session_id: str


@router.get("/status")
def status():
    return {"status": "ok"}


@router.get("/agents")
def list_agents():
    return {agent_id: agent for agent_id, agent in agents.items()}


@router.post("/agents", status_code=201)
def create_agent(agent: AgentCreate):
    task = random.choice(TASKS)
    agents[agent.session_id] = {"owner": agent.owner, "task": task}
    save_agents()
    return {"id": agent.session_id, **agents[agent.session_id]}


@router.delete("/agents/{agent_id}")
def delete_agent(agent_id: str):
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    del agents[agent_id]
    save_agents()
    return {"detail": "Agent removed"}
