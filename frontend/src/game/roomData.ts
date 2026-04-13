import { ROOM, FURNITURE } from "./palette";

export type TileRef = {
  sheet: "room" | "interiors";
  col: number;
  row: number;
};

export interface RoomData {
  width: number;
  height: number;
  tileSize: number;
  base: (TileRef | null)[][];
  objects: (TileRef | null)[][];
}

function r(coords: readonly [number, number]): TileRef {
  return { sheet: "room", col: coords[0], row: coords[1] };
}

function f(coords: readonly [number, number]): TileRef {
  return { sheet: "interiors", col: coords[0], row: coords[1] };
}

const _ = null;

// Helper to make a row of floor tiles
function floorRow(width: number): (TileRef | null)[] {
  return Array.from({ length: width }, (__, c) => {
    if (c === 0) return r(ROOM.WALL_BOT_L);
    if (c === width - 1) return r(ROOM.WALL_BOT_R);
    return c % 2 === 0 ? r(ROOM.FLOOR_1) : r(ROOM.FLOOR_2);
  });
}

const W = 14;

export const cozyOffice: RoomData = {
  width: W,
  height: 10,
  tileSize: 32,
  base: [
    // Row 0: wall tops
    [r(ROOM.WALL_TOP_L), ...Array(W - 2).fill(null).map(() => r(ROOM.WALL_TOP_M)), r(ROOM.WALL_TOP_R)],
    // Row 1: wall bottoms
    [r(ROOM.WALL_BOT_L), ...Array(W - 2).fill(null).map(() => r(ROOM.WALL_BOT_M)), r(ROOM.WALL_BOT_R)],
    // Rows 2-8: floor with side walls
    floorRow(W),
    floorRow(W),
    floorRow(W),
    floorRow(W),
    floorRow(W),
    floorRow(W),
    floorRow(W),
    // Row 9: bottom wall
    [r(ROOM.WALL_TOP_L), ...Array(W - 2).fill(null).map(() => r(ROOM.WALL_TOP_M)), r(ROOM.WALL_TOP_R)],
  ],
  objects: [
    // Row 0: nothing
    Array(W).fill(_),
    // Row 1: whiteboard on wall
    [_, _, _, _, _, f(FURNITURE.BOARD_TL), f(FURNITURE.BOARD_TR), _, _, _, _, _, _, _],
    // Row 2: desks + board bottom + bookshelf
    [_, f(FURNITURE.DESK_CHAIR_TL), f(FURNITURE.DESK_CHAIR_TR), _, _, f(FURNITURE.BOARD_BL), f(FURNITURE.BOARD_BR), _, _, _, f(FURNITURE.DESK_CHAIR_TL), f(FURNITURE.DESK_CHAIR_TR), _, _],
    // Row 3: desk bottoms + plant
    [_, f(FURNITURE.DESK_CHAIR_BL), f(FURNITURE.DESK_CHAIR_BR), _, _, _, _, _, _, _, f(FURNITURE.DESK_CHAIR_BL), f(FURNITURE.DESK_CHAIR_BR), _, _],
    // Row 4: chairs
    [_, _, f(FURNITURE.CHAIR_L), _, _, _, _, _, _, _, _, f(FURNITURE.CHAIR_L), _, _],
    // Row 5: rug + plant tops
    [_, _, _, _, _, _, f(FURNITURE.RUG_TL), f(FURNITURE.RUG_TR), _, _, _, _, _, _],
    // Row 6: rug bottom
    [_, _, _, _, _, _, f(FURNITURE.RUG_BL), f(FURNITURE.RUG_BR), _, _, _, _, _, _],
    // Row 7: plants
    [_, f(FURNITURE.PLANT_1_B), _, _, _, _, _, _, _, _, _, _, f(FURNITURE.PLANT_2_B), _],
    // Row 8: shelf + couch
    [_, f(FURNITURE.SHELF_BL), f(FURNITURE.SHELF_BR), _, _, f(FURNITURE.COUCH_TL), f(FURNITURE.COUCH_TR), _, _, _, _, f(FURNITURE.FRIDGE_B), _, _],
    // Row 9: nothing
    Array(W).fill(_),
  ],
};
