import * as ex from "excalibur";
import roomBuilderUrl from "../assets/Modern tiles_Free/Interiors_free/16x16/Room_Builder_free_16x16.png";
import interiorsUrl from "../assets/Modern tiles_Free/Interiors_free/16x16/Interiors_free_16x16.png";

const SRC_TILE = 16;
const DRAW_TILE = 32;
const ROOM_W = 20;
const ROOM_H = 12;

const roomBuilderImage = new ex.ImageSource(roomBuilderUrl, {
  filtering: ex.ImageFiltering.Pixel,
});
const interiorsImage = new ex.ImageSource(interiorsUrl, {
  filtering: ex.ImageFiltering.Pixel,
});

export const loader = new ex.Loader([roomBuilderImage, interiorsImage]);
loader.suppressPlayButton = true;

function roomSprite(col: number, row: number): ex.Sprite {
  const sprite = new ex.Sprite({
    image: roomBuilderImage,
    sourceView: { x: col * SRC_TILE, y: row * SRC_TILE, width: SRC_TILE, height: SRC_TILE },
  });
  sprite.scale = ex.vec(2, 2);
  return sprite;
}

function interiorSprite(col: number, row: number): ex.Sprite {
  const sprite = new ex.Sprite({
    image: interiorsImage,
    sourceView: { x: col * SRC_TILE, y: row * SRC_TILE, width: SRC_TILE, height: SRC_TILE },
  });
  sprite.scale = ex.vec(2, 2);
  return sprite;
}

function placeTile(scene: ex.Scene, sprite: ex.Sprite, col: number, row: number, z = 0) {
  const actor = new ex.Actor({
    x: col * DRAW_TILE + DRAW_TILE / 2,
    y: row * DRAW_TILE + DRAW_TILE / 2,
    anchor: ex.vec(0.5, 0.5),
    z,
  });
  actor.graphics.use(sprite);
  scene.add(actor);
}

function placeMultiTile(
  scene: ex.Scene,
  spriteFn: (col: number, row: number) => ex.Sprite,
  srcCol: number, srcRow: number,
  destCol: number, destRow: number,
  w: number, h: number,
  z = 2,
) {
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      placeTile(scene, spriteFn(srcCol + c, srcRow + r), destCol + c, destRow + r, z);
    }
  }
}

export class RoomScene extends ex.Scene {
  onInitialize(_engine: ex.Engine): void {
    // ── Background fill ──
    for (let row = 0; row < ROOM_H; row++) {
      for (let col = 0; col < ROOM_W; col++) {
        const bg = new ex.Actor({
          x: col * DRAW_TILE + DRAW_TILE / 2,
          y: row * DRAW_TILE + DRAW_TILE / 2,
          anchor: ex.vec(0.5, 0.5),
          z: -1,
        });
        bg.graphics.use(new ex.Rectangle({ width: DRAW_TILE, height: DRAW_TILE, color: ex.Color.fromHex("#d4c69a") }));
        this.add(bg);
      }
    }

    // ── Floor tiles (two zones) ──
    for (let row = 0; row < ROOM_H; row++) {
      for (let col = 0; col < ROOM_W; col++) {
        if (col <= 10) {
          // Warm beige/tan floor - seamless tile
          placeTile(this, roomSprite(5, 19), col, row, 0);
        } else {
          // Gray concrete floor - seamless tile
          placeTile(this, roomSprite(12, 12), col, row, 0);
        }
      }
    }

    // ── Walls ──
    // Top wall: row 5 (baseboard as ceiling trim) + row 6 (solid wall)
    for (let col = 0; col < ROOM_W; col++) {
      let wc5 = 1;  // row 5 edge: 0=left, 1=mid, 6=right
      let wc6 = 1;  // row 6 edge: 0=left, 1=mid, 3=right
      if (col === 0) { wc5 = 0; wc6 = 0; }
      if (col === ROOM_W - 1) { wc5 = 6; wc6 = 3; }
      placeTile(this, roomSprite(wc5, 5), col, 0, 1);
      placeTile(this, roomSprite(wc6, 6), col, 1, 1);
    }
    // Bottom wall
    for (let col = 0; col < ROOM_W; col++) {
      let wc = 1;
      if (col === 0) wc = 0;
      if (col === ROOM_W - 1) wc = 6;
      placeTile(this, roomSprite(wc, 5), col, ROOM_H - 1, 1);
    }
    // Side walls
    for (let row = 2; row < ROOM_H - 1; row++) {
      placeTile(this, roomSprite(0, 6), 0, row, 1);
      placeTile(this, roomSprite(3, 6), ROOM_W - 1, row, 1);
    }

    // Interior divider wall at col 10 (doorway at rows 5-6)
    for (let row = 2; row < ROOM_H - 1; row++) {
      if (row === 5 || row === 6) continue;
      placeTile(this, roomSprite(1, 6), 10, row, 1);
    }

    // ══════════════════════════════════════
    //  LIVING ROOM — cozy seating area
    //    1  2  3  4  5  6  7  8  9
    //  1 BK BK .  P1 TV TV BB BB P2   bookshelf + paintings + TV
    //  2 BK BK .  .  TV TV BB BB .    TV + bulletin board
    //  3 BK BK .  .  .  .  .  .  .    bookshelf bottom
    //  4 .  .  .  CT CT RG RG RG .    coffee table + rug
    //  5 .  .  SO SO RG RG RG .  .    sofa + rug
    //  6 .  .  SO SO RG RG RG .  .    sofa + rug
    //  7 .  .  AC AC RG RG RG .  .    armchair + rug
    //  8 .  .  AC AC .  .  .  .  .    armchair bottom
    //  9 LP PL .  .  .  .  .  .  PL   lamp + plants
    // ══════════════════════════════════════

    // Bookshelf against top wall (2w x 3h)
    placeMultiTile(this, interiorSprite, 5, 15, 1, 1, 2, 3);

    // TV / desk with monitor (2w x 2h)
    placeMultiTile(this, interiorSprite, 0, 33, 5, 2, 2, 2);

    // Bulletin board (2w x 1h)
    placeMultiTile(this, interiorSprite, 13, 39, 7, 2, 2, 1);

    // Rug (3w x 4h) — anchor of the seating area
    placeMultiTile(this, interiorSprite, 8, 16, 5, 4, 3, 4);

    // Decorative coffee table (2w x 2h) — between TV and sofa
    placeMultiTile(this, interiorSprite, 4, 54, 4, 4, 2, 2);

    // Grey-blue sofa (2w x 2h) — facing right
    placeMultiTile(this, interiorSprite, 1, 72, 3, 5, 2, 2);

    // Grey armchair (2w x 2h) — below sofa
    placeMultiTile(this, interiorSprite, 1, 74, 3, 7, 2, 2);

    // Paintings on top wall
    placeTile(this, interiorSprite(0, 13), 4, 1, 2);
    placeTile(this, interiorSprite(4, 13), 9, 1, 2);

    // Blue floor lamp bottom-left (1w x 2h)
    placeMultiTile(this, interiorSprite, 13, 56, 1, 9, 1, 2);

    // Large plant bottom-left (2w x 2h)
    placeMultiTile(this, interiorSprite, 14, 44, 2, 9, 2, 2);

    // Small plant near divider (1w x 2h)
    placeMultiTile(this, interiorSprite, 11, 44, 9, 9, 1, 2);

    // ══════════════════════════════════════
    //  KITCHEN — counters + dining nook
    //   11 12 13 14 15 16 17 18
    //  1 .  P3 CK CK CK CK PB PB   painting + counters + pantry
    //  2 .  .  CK CK CK CK FR PB   counters + fridge + pantry
    //  3 .  .  CK CK .  .  FR PB   counter bottom + fridge
    //  4 .  FT FT .  .  KC KC .    fruit counter + cabinet
    //  5 .  FT FT .  .  KC KC .    bottom halves
    //  6 .  .  GR GR GR .  .  .    green rug
    //  7 .  CH DT DT GR GR GR CH   chairs + table + rug
    //  8 .  .  DT DT GR GR GR .    table bottom + rug
    //  9 .  CA .  .  .  .  .  PL   cactus + plant
    // ══════════════════════════════════════

    // Pantry bookshelf (2w x 3h)
    placeMultiTile(this, interiorSprite, 5, 15, 17, 1, 2, 3);

    // Painting on kitchen wall
    placeTile(this, interiorSprite(0, 13), 12, 1, 2);

    // Kitchen counters along top wall (2w x 2h each)
    placeMultiTile(this, interiorSprite, 2, 33, 13, 2, 2, 2);
    placeMultiTile(this, interiorSprite, 4, 33, 15, 2, 2, 2);

    // Grey fridge (1w x 2h) — left of pantry
    placeMultiTile(this, interiorSprite, 12, 40, 16, 2, 1, 2);

    // Counter with fruit/food (2w x 2h)
    placeMultiTile(this, interiorSprite, 0, 56, 12, 4, 2, 2);

    // Kitchen cabinet (2w x 2h)
    placeMultiTile(this, interiorSprite, 7, 50, 16, 4, 2, 2);

    // Green rug under dining area (3w x 2h)
    placeMultiTile(this, interiorSprite, 0, 42, 12, 6, 3, 2);

    // Dining chair left of table
    placeTile(this, interiorSprite(3, 40), 12, 7, 2);

    // Dining table (2w x 2h)
    placeMultiTile(this, interiorSprite, 2, 50, 13, 7, 2, 2);

    // Dining chair right of table
    placeTile(this, interiorSprite(4, 40), 15, 7, 2);

    // Counter with cutting board along right wall (2w x 2h)
    placeMultiTile(this, interiorSprite, 4, 58, 17, 4, 2, 2);

    // Bench with plants along right side (2w x 2h)
    placeMultiTile(this, interiorSprite, 2, 52, 16, 7, 2, 2);

    // Shelf with lamp + cactus (2w x 2h) — decorative shelf
    placeMultiTile(this, interiorSprite, 12, 52, 16, 9, 2, 2);

    // Small cactus plant near divider (1w x 2h)
    placeMultiTile(this, interiorSprite, 0, 48, 12, 9, 1, 2);

    // Small plant kitchen corner (1w x 2h)
    placeMultiTile(this, interiorSprite, 11, 44, 18, 9, 1, 2);

    // ── Camera ──
    this.camera.pos = ex.vec((ROOM_W * DRAW_TILE) / 2, (ROOM_H * DRAW_TILE) / 2);
  }
}
