export const GRID_SIZE = 32;
export const GRID_MIN = -Math.PI;
export const GRID_MAX = Math.PI;

export const generateGrid = (size, min, max) => {
  const step = (max - min) / (size - 1);
  return Array.from({ length: size }, (_, index) => min + index * step);
};

export const GRID_VALUES = generateGrid(GRID_SIZE, GRID_MIN, GRID_MAX);
