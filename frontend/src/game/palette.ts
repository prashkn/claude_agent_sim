// Tile coordinates [col, row] into the sprite sheets (32x32 tiles)
// Mapped from visual inspection of debug grid view

// Room_Builder_free_32x32.png (17 cols x 23 rows)
// Wall colors come in sets of 2 rows, 3 cols (left, mid-window, right)
// Large black tiles = window/transparency areas
// Floor patterns on the right side (cols 7+)

export const ROOM = {
  // Cream/orange wall - top half (row 0)
  WALL_1_L: [0, 0] as const,  // left wall stripe
  WALL_1_M: [1, 0] as const,  // mid wall stripe
  WALL_1_R: [2, 0] as const,  // right wall stripe

  // Cream/orange wall - bottom half (row 1)
  WALL_2_L: [0, 1] as const,
  WALL_2_M: [1, 1] as const,
  WALL_2_R: [2, 1] as const,

  // Mint/cyan wall (row 2-3)
  WALL_3_L: [0, 2] as const,
  WALL_3_M: [1, 2] as const,
  WALL_3_R: [2, 2] as const,
  WALL_4_L: [0, 3] as const,
  WALL_4_M: [1, 3] as const,
  WALL_4_R: [2, 3] as const,

  // Wood floor/wall (rows 4-5) - brown planks
  WOOD_1_L: [0, 4] as const,
  WOOD_1_M: [1, 4] as const,
  WOOD_1_R: [2, 4] as const,
  WOOD_2_L: [0, 5] as const,
  WOOD_2_M: [1, 5] as const,
  WOOD_2_R: [2, 5] as const,

  // Floor patterns (right side of sheet)
  // Yellow checkered (cols 9-10, rows 0-1)
  FLOOR_CHECK_1: [9, 0] as const,
  FLOOR_CHECK_2: [10, 0] as const,
  FLOOR_CHECK_3: [9, 1] as const,
  FLOOR_CHECK_4: [10, 1] as const,

  // Grey stone (cols 11-12, rows 0-1)
  FLOOR_GREY_1: [11, 0] as const,
  FLOOR_GREY_2: [12, 0] as const,

  // Grey tile floor (cols 9-10, row 2)
  FLOOR_TILE_1: [9, 2] as const,
  FLOOR_TILE_2: [10, 2] as const,

  // Light grey (cols 11-12, row 2)
  FLOOR_LGREY_1: [11, 2] as const,
  FLOOR_LGREY_2: [12, 2] as const,
} as const;
