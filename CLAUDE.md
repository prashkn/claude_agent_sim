# Claude Agent Sims Display

## Context
Build a fun Raspberry Pi-hosted website that visualizes running Claude CLI agents as Sims-like characters wandering around a little world. When you spawn Claude agents on your dev machine(s), they register with the Pi via Claude Code hooks. The Pi serves a React frontend where each agent gets a goofy 8-bit character with their name, task, and idle animations.

## Architecture Overview

```
┌─────────────────────┐                            ┌──────────────────────┐
│  Prashant's Machine  │──── HTTP POST ───────────>│   Raspberry Pi       │
│  Claude CLI + Hooks  │   (agent start/stop)       │   (static local IP)  │
└─────────────────────┘                            │                      │
                                                    │  FastAPI Server      │
┌─────────────────────┐                            │  - POST /agents      │
│  Roommate's Machine  │──── HTTP POST ───────────>│  - DELETE /agents/:id│
│  Claude CLI + Hooks  │   (agent start/stop)       │  - GET /agents/stream│
└─────────────────────┘                            │    (SSE endpoint)    │
                                                    │                      │
   All on same WiFi network (192.168.x.x)          │  Serves React build  │
                                                    └──────────┬───────────┘
                                                               │ SSE
                                                               v
                                                    ┌──────────────────────┐
                                                    │  TV / Any Browser    │
                                                    │  http://<pi-ip>:8000 │
                                                    │                      │
                                                    │  React + Excalibur.js      │
                                                    │  - 2D "room" scene   │
                                                    │  - Sprite characters │
                                                    │  - Owner color-coded │
                                                    │  - Name/task labels  │
                                                    └──────────────────────┘
```

## Network & Multi-User Setup

**Requirement:** All machines (dev machines + Pi + TV) on the same WiFi network.

**Raspberry Pi static IP:**
- Assign via router admin (DHCP reservation) or on the Pi itself (`/etc/dhcpcd.conf` or NetworkManager)
- Example: `192.168.1.100` — all hooks and browsers point here

**TV display options (in order of preference):**
1. **Pi direct to TV via HDMI** — Run a kiosk-mode browser (Chromium `--kiosk`) on the Pi itself. Best performance, no smart TV browser jank.
2. **Smart TV browser** — Navigate to `http://<pi-ip>:8000`. Works but quality varies by TV.
3. **Chromecast / Fire Stick** — Cast a browser tab or use the device's built-in browser.

**Adding a new user (roommate, guest, etc.):**
1. Install Claude Code on their machine
2. Copy the hook config into their `~/.claude/settings.json` (just needs the Pi IP and their name)
3. Done — their agents show up on the TV with their name

## Tech Stack
- **Backend**: Python + FastAPI (on Raspberry Pi)
- **Frontend**: React + Excalibur.js
- **Real-time**: Frontend polls GET /agents every few seconds (no SSE)
- **Agent notification**: Claude Code hooks

## Components

### 1. Claude Code Hooks (Dev Machine — each user)

Each user configures hooks in their `~/.claude/settings.json` to fire on agent lifecycle events:
- **On session start**: `curl -X POST http://<pi-ip>:8000/agents -d '{"owner":"prashant", "name":"...", "task":"..."}'`
- **On session end**: `curl -X DELETE http://<pi-ip>:8000/agents/<id>`

The `owner` field identifies whose agent it is. Each user sets their name in the hook script once.

### 2. FastAPI Backend (Raspberry Pi)

- **`POST /agents`** — Register a new agent. Accepts `owner`, `name`, `task`. Assigns a random character sprite, position, and color. Returns an agent ID.
- **`DELETE /agents/{id}`** — Remove agent when session ends. Triggers a "goodbye" animation on the frontend.
- **`GET /agents`** — List all active agents. Frontend polls this every few seconds.
- **In-memory store** — Simple dict of active agents. Optionally persist to a JSON file so agents survive server restarts.

### 3. React + Excalibur.js Frontend

A 2D top-down world rendered on a canvas with full 8-bit retro aesthetic.

**Room Themes (randomized or cycled):**
- Cozy dev office — desks, monitors, coffee mugs, bookshelves, plants
- Retro RPG town square — grass, paths, fountain, trees, little buildings
- Space station bridge — control panels, stars through windows, corridors
- The server picks a random theme on startup (or cycles). Each theme is a tilemap background with designated walkable areas and "interaction points" (desk to sit at, fountain to stand by, etc.)

**Characters:**
- Sourced from free itch.io 8-bit/16-bit sprite packs (16x16 or 32x32 character sheets)
- Each agent gets a randomly assigned character sprite from the pool (no duplicates while possible)
- Animation states: walk-down, walk-up, walk-left, walk-right, idle, sit, wave
- Pixel-perfect rendering (nearest-neighbor scaling, no anti-aliasing blur)

**Wandering AI (client-side):**
- Characters pick random walkable waypoints in the room
- Walk there with appropriate directional animation
- Idle at the waypoint for a random duration (2-8 seconds)
- Occasionally "interact" with furniture — sit at a desk, stand by the coffee machine, look out the window
- Simple collision avoidance so characters don't stack on top of each other

**UI Elements:**
- Floating pixel-art name tags above each character with owner name, agent name + task
- Owner color-coding — each user gets a distinct color for their name tags (e.g., Prashant = blue, roommate = green)
- Speech bubble that occasionally shows a random fun quip ("compiling...", "hmm interesting", "found a bug!", "refactoring...")
- Pop-in animation with pixel sparkle effect when a new agent joins
- Wave + fade-out when an agent leaves
- Bottom or side panel showing a text log of agent arrivals/departures
- CRT scanline filter or pixel grid overlay option for extra retro vibes

### 4. Sprite & Tilemap Assets

**Source: Free itch.io asset packs** (MIT/CC0 licensed)
- Character sprites: Packs with multiple character designs + walk cycle animations (4-direction, 3-4 frames each)
- Tilesets: Interior tileset (office furniture, floors, walls), outdoor tileset (grass, paths, trees), sci-fi tileset (metal floors, panels, screens)
- Room backgrounds: Built from tilesets using a simple JSON tilemap format, or pre-composed as single images
- Bundle in `frontend/src/assets/`

**Asset recommendations to search for on itch.io:**
- "Tiny RPG Character Asset Pack" style packs (multiple characters)
- "Modern Interior Tileset" for the office room
- "RPG Nature Tileset" for the village room
- "Sci-Fi Interior Tileset" for the space station room

## Project Structure

```
claude_display/
├── server/                  # Raspberry Pi backend
│   ├── main.py              # FastAPI app
│   ├── models.py            # Agent data models
│   ├── store.py             # In-memory agent store
│   └── requirements.txt     # fastapi, uvicorn
├── frontend/                # React app
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── World.tsx    # Excalibur.js canvas scene
│   │   │   ├── Character.tsx # Individual character sprite + label
│   │   │   └── AgentList.tsx # Sidebar list of active agents
│   │   ├── hooks/
│   │   │   └── useAgents.ts       # Polling hook for GET /agents
│   │   └── assets/          # Sprite sheets, room background
│   └── package.json
└── CLAUDE.md
```

## Development Phases

### Phase 1: Server MVP
- FastAPI with agent CRUD
- Test with manual curl commands
- JSON file persistence for agent state

### Phase 2: Assets & Scene Setup
- Source and download free sprite packs from itch.io (characters + tilesets)
- Create/compose tilemap backgrounds for at least 2 room themes
- Set up Excalibur.js with pixel-perfect rendering (nearest-neighbor scaling)
- Get one character sprite walking around a room

### Phase 3: Frontend Core
- React app with Excalibur.js canvas, full room scene
- Character spawning/despawning with animations
- Wandering AI with directional walk cycles
- Name tags, speech bubbles, interaction points
- Polling integration — characters appear/disappear as frontend polls

### Phase 4: Claude Code Hooks
- Configure hooks in settings.json
- Write hook script that extracts session info and POSTs to Pi
- Test end-to-end: spawn Claude agent -> character appears on screen

### Phase 5: Polish & Fun
- All 3 room themes working with random selection
- CRT/scanline overlay option
- Arrival confetti / departure wave animations
- Activity log panel
- Mobile-friendly responsive layout
- Multiple character sprite variety (8-16 unique characters)

## Verification
1. Start the FastAPI server on Pi (or locally for dev): `uvicorn server.main:app`
2. Open the frontend in a browser
3. `curl -X POST localhost:8000/agents -H 'Content-Type: application/json' -d '{"name":"test","task":"debugging"}'` — character should appear
4. Configure Claude Code hooks and spawn an agent — character should appear automatically
5. End the agent session — character should wave and disappear
