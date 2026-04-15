import * as ex from "excalibur";
import { AgentCharacter } from "./characters";

export interface AgentData {
  owner: string;
  task: string;
}

const POLL_INTERVAL = 10_000;

let spriteCounter = 0;

export class AgentScene extends ex.Scene {
  private characters = new Map<string, AgentCharacter>();
  private pollTimer = 0;

  onInitialize(engine: ex.Engine): void {
    this.pollTimer = 0;
    this.fetchAndSync(engine);
  }

  onPreUpdate(engine: ex.Engine, delta: number): void {
    this.pollTimer += delta;
    if (this.pollTimer >= POLL_INTERVAL) {
      this.pollTimer = 0;
      this.fetchAndSync(engine);
    }
  }

  private async fetchAndSync(engine: ex.Engine) {
    try {
      const res = await fetch("/agents");
      if (res.ok) {
        const agents: Record<string, AgentData> = await res.json();
        this.syncAgents(agents, engine);
      }
    } catch {
      // server unreachable
    }
  }

  private syncAgents(agents: Record<string, AgentData>, engine: ex.Engine) {
    const incomingIds = new Set(Object.keys(agents));

    // Remove characters no longer in the agent list
    for (const [id, char] of this.characters) {
      if (!incomingIds.has(id)) {
        this.remove(char);
        this.characters.delete(id);
      }
    }

    // Add new characters
    for (const [id, data] of Object.entries(agents)) {
      if (!this.characters.has(id)) {
        const char = new AgentCharacter(id, data.owner, data.task, spriteCounter++);
        char.setBounds(engine.drawWidth, engine.drawHeight);
        this.add(char);
        this.characters.set(id, char);
      }
    }
  }
}
