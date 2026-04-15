import { useEffect, useRef } from "react";
import * as ex from "excalibur";
import { createEngine } from "../game/engine";
import { charLoader } from "../game/characters";
import { AgentScene } from "../game/AgentScene";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ex.Engine | null>(null);

  useEffect(() => {
    if (!canvasRef.current || engineRef.current) return;

    const engine = createEngine(canvasRef.current);
    engine.addScene("agents", new AgentScene());

    engine.start(charLoader).then(() => {
      engine.goToScene("agents");
    });
    engineRef.current = engine;

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        imageRendering: "pixelated",
        display: "block",
      }}
    />
  );
}
