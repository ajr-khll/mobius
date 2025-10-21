import * as math from 'mathjs';

import {
  DEFAULT_Z_RANGE,
  GRID_RANGE,
  GRID_SIZE,
  INEQUALITY_Z_STEPS,
  generateGrid,
} from './grid';

const MIN_REGION_VALUE = 1e-6;

const clampRange = (range, fallback) => {
  if (!Array.isArray(range) || range.length !== 2) {
    return [...fallback];
  }

  const [startRaw, endRaw] = range;
  const start = Number.isFinite(startRaw) ? Number(startRaw) : fallback[0];
  let end = Number.isFinite(endRaw) ? Number(endRaw) : fallback[1];

  if (start === end) {
    end = start + 1;
  }

  if (start > end) {
    return [end, start];
  }

  return [start, end];
};

const roundValue = (value, precision = 4) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return NaN;
  }
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const hexToRgba = (hex, alpha) => {
  if (!hex) {
    return `rgba(111, 156, 229, ${alpha})`;
  }

  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return `rgba(111, 156, 229, ${alpha})`;
  }

  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const createInequalityRegionDefinition = ({
  id,
  symbol,
  expression,
  operator = '>=',
  accent = '#62b0ff',
  xRange,
  yRange,
  zRange,
}) => {
  if (!expression) {
    throw new Error('Inequality regions require an expression describing z as a function of x and y.');
  }

  const normalizedOperator = operator === '>' ? '>' : '>=';
  const [xMin, xMax] = clampRange(xRange, GRID_RANGE);
  const [yMin, yMax] = clampRange(yRange, GRID_RANGE);
  const [zMin, zMax] = clampRange(zRange, DEFAULT_Z_RANGE);

  if (zMax <= zMin) {
    throw new Error('Invalid z-range supplied for inequality region.');
  }

  const compiled = math.compile(expression);
  const evaluator = (x, y) => compiled.evaluate({ x, y });

  const xValues = generateGrid(GRID_SIZE, xMin, xMax);
  const yValues = generateGrid(GRID_SIZE, yMin, yMax);
  const zValues = generateGrid(INEQUALITY_Z_STEPS, zMin, zMax);

  let didLogError = false;
  const boundary = yValues.map((y) =>
    xValues.map((x) => {
      try {
        return roundValue(Number(evaluator(x, y)));
      } catch (error) {
        if (!didLogError) {
          console.error('Failed to evaluate inequality boundary point:', error);
          didLogError = true;
        }
        return NaN;
      }
    })
  );

  const gridPoints = {
    x: [],
    y: [],
    z: [],
    value: [],
  };

  const strictEpsilon = 1e-4;
  let positiveMax = 0;

  for (let zi = 0; zi < zValues.length; zi += 1) {
    const z = zValues[zi];
    for (let yi = 0; yi < yValues.length; yi += 1) {
      const y = yValues[yi];
      for (let xi = 0; xi < xValues.length; xi += 1) {
        const x = xValues[xi];
        const boundaryValue = boundary[yi][xi];
        if (!Number.isFinite(boundaryValue)) {
          continue;
        }

        const difference = roundValue(z - boundaryValue, 6);
        gridPoints.x.push(x);
        gridPoints.y.push(y);
        gridPoints.z.push(z);
        gridPoints.value.push(difference);
        if (Number.isFinite(difference) && difference > positiveMax) {
          positiveMax = difference;
        }
      }
    }
  }

  const hasRegion = positiveMax > (normalizedOperator === '>' ? strictEpsilon : MIN_REGION_VALUE);

  const regionTrace = hasRegion
    ? {
        type: 'isosurface',
        name: `${symbol} region`,
        showlegend: false,
        x: gridPoints.x,
        y: gridPoints.y,
        z: gridPoints.z,
        value: gridPoints.value,
        isomin: normalizedOperator === '>=' ? 0 : strictEpsilon,
        isomax: Math.max(positiveMax, strictEpsilon * 10),
        opacity: normalizedOperator === '>=' ? 0.32 : 0.24,
        // A single surface keeps planar inequalities from rendering duplicate parallel planes.
        surface: { show: true, count: 1, fill: 1 },
        caps: {
          x: { show: false },
          y: { show: false },
          z: { show: true, color: hexToRgba(accent, 0.55) },
        },
        colorscale: [
          [0, hexToRgba(accent, 0.12)],
          [1, hexToRgba(accent, 0.58)],
        ],
        lighting: {
          ambient: 0.45,
          diffuse: 0.6,
          specular: 0.05,
          fresnel: 0.2,
        },
        hoverinfo: 'skip',
        showscale: false,
      }
    : null;

  const boundaryTrace = {
    type: 'surface',
    name: `${symbol} boundary`,
    showlegend: false,
    x: xValues,
    y: yValues,
    z: boundary,
    opacity: normalizedOperator === '>=' ? 0.5 : 0.28,
    colorscale: [
      [0, hexToRgba(accent, normalizedOperator === '>=' ? 0.7 : 0.3)],
      [1, hexToRgba(accent, normalizedOperator === '>=' ? 0.85 : 0.32)],
    ],
    showscale: false,
    hovertemplate: 'x=%{x:.3f}<br>y=%{y:.3f}<br>z=%{z:.3f}<extra></extra>',
    contours:
      normalizedOperator === '>'
        ? {
            x: { show: true, color: hexToRgba(accent, 0.9), width: 1.5 },
            y: { show: true, color: hexToRgba(accent, 0.9), width: 1.5 },
            z: { show: false },
          }
        : {
            x: { show: false },
            y: { show: false },
            z: { show: false },
          },
  };

  return {
    id,
    type: 'inequality_region',
    symbol,
    accent,
    expression,
    operator: normalizedOperator,
    evaluator,
    xRange: [xMin, xMax],
    yRange: [yMin, yMax],
    zRange: [zMin, zMax],
    label: `Region where z ${normalizedOperator} ${expression}`,
    inequality: {
      operator: normalizedOperator,
      expression,
    },
    plot: regionTrace,
    auxiliaryPlots: [boundaryTrace].filter(Boolean),
  };
};
