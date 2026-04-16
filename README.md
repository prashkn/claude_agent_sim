# Claude Agent Sims

A fun Raspberry Pi-hosted app that visualizes your running Claude CLI agents as Sims-like 8-bit characters wandering around a little pixel world. When you spawn Claude agents on your dev machine, they register with the Pi via [Claude Code hooks](https://docs.anthropic.com/en/docs/claude-code/hooks), and a character pops into the scene on your TV.

![Architecture: Dev machines send HTTP requests to Pi via hooks, Pi serves a React frontend to any browser on the network](https://img.shields.io/badge/stack-FastAPI_+_React_+_Excalibur.js-blue)

https://github.com/user-attachments/assets/c9997ad8-1638-4955-934f-50c52fa517bc

## How it works

1. **Claude Code hooks** on your dev machine fire HTTP requests to the Pi when an agent starts or stops
2. **FastAPI backend** on the Pi tracks active agents in memory
3. **React + Excalibur.js frontend** renders a 2D pixel-art room where each agent is a character that wanders around, sits at desks, and occasionally says things like *"found a bug!"*

```
Dev Machine (hooks)  ──POST/DELETE──>  Raspberry Pi (FastAPI)  ──serves──>  TV / Browser
                                                                            (React + Excalibur.js)
```

All machines just need to be on the same WiFi network.

## Running it

### Backend (on the Pi)

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run build
# Serve the build from the Pi, or run `npm start` for dev
```

### Test it

```bash
# Add an agent
curl -X POST http://<pi-ip>:8000/agents \
  -H 'Content-Type: application/json' \
  -d '{"name": "test-agent", "task": "debugging", "owner": "prashant"}'

# Remove an agent
curl -X DELETE http://<pi-ip>:8000/agents/<id>
```

## Setting up hooks

Add this to your `~/.claude/settings.json` so agents auto-register when you use Claude Code:

```json
{
  "hooks": {
    "session_start": "curl -s -X POST http://<pi-ip>:8000/agents -H 'Content-Type: application/json' -d '{\"owner\":\"yourname\", \"name\":\"$CLAUDE_SESSION_ID\", \"task\":\"working\"}'",
    "session_end": "curl -s -X DELETE http://<pi-ip>:8000/agents/$CLAUDE_SESSION_ID"
  }
}
```

## Adding more people

Anyone on the same WiFi can join — just install Claude Code, copy the hook config with their name, and their agents show up on the TV in their own color.
