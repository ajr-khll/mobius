import * as math from 'mathjs';

import { generateGrid } from './grid';

const roundValue = (value, precision = 4) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return NaN;
  }
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const createPlanarFunctionDefinition = ({
  id,
  symbol,
  expression,
  domain,
  accent,
  samples = 200,
}) => {
  if (!expression) {
    throw new Error('Planar functions require an expression in terms of x.');
  }

  const { start = -Math.PI, end = Math.PI } = domain || {};
  if (!Number.isFinite(start) || !Number.isFinite(end) || start === end) {
    throw new Error('Planar functions require a valid domain range.');
  }

  const pointCount = Math.max(2, samples);
  const xValues = generateGrid(pointCount, start, end);
  const code = math.compile(expression);

  let didLogError = false;
  const yValues = xValues.map((x) => {
    try {
      return roundValue(Number(code.evaluate({ x })));
    } catch (error) {
      if (!didLogError) {
        console.error('Failed to evaluate planar function point:', error);
        didLogError = true;
      }
      return NaN;
    }
  });

  return {
    id,
    symbol,
    label: `${symbol}(x) = ${expression}`,
    accent,
    expression,
    domain: { start, end, samples: pointCount },
    plot: {
      type: 'scatter3d',
      mode: 'lines',
      x: xValues,
      y: yValues,
      z: Array.from({ length: pointCount }, () => 0),
      line: {
        color: accent,
        width: 6,
      },
      name: `${symbol}(x)`,
      showlegend: false,
      hovertemplate: 'x=%{x:.3f}<br>y=%{y:.3f}<extra></extra>',
    },
  };
};
