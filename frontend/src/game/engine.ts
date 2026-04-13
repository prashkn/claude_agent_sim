import * as ex from "excalibur";

export function createEngine(canvasElement: HTMLCanvasElement): ex.Engine {
  const roomWidth = 20 * 32;
  const roomHeight = 12 * 32;

  return new ex.Engine({
    canvasElement,
    width: roomWidth,
    height: roomHeight,
    fixedUpdateFps: 30,
    pixelArt: true,
    antialiasing: false,
    displayMode: ex.DisplayMode.FitScreen,
    backgroundColor: ex.Color.fromHex("#1a1a2e"),
    resolution: {
      width: roomWidth,
      height: roomHeight,
    },
  });
}
