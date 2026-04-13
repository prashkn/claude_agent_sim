import json
from pathlib import Path

AGENTS_FILE = Path(__file__).parent / "agents.json"

agents: dict[str, dict] = {}


def load_agents():
    if AGENTS_FILE.exists():
        agents.update(json.loads(AGENTS_FILE.read_text()))


def save_agents():
    AGENTS_FILE.write_text(json.dumps(agents, indent=2))