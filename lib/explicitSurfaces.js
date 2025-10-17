import * as math from 'mathjs';

const roundValue = (value, precision = 4) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return NaN;
  }
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const createExplicitSurfaceEvaluator = (expression) => {
  if (!expression) {
    throw new Error('An explicit surface requires a non-empty expression.');
  }

  const compiled = math.compile(expression);
  return (x, y) => compiled.evaluate({ x, y });
};

export const buildExplicitSurfacePlot = ({
  evaluator,
  gridValues,
  opacity,
  colorscale,
}) => {
  let didLogError = false;
  const z = gridValues.map((y) =>
    gridValues.map((x) => {
      try {
        return roundValue(evaluator(x, y));
      } catch (error) {
        if (!didLogError) {
          console.error('Failed to evaluate explicit surface point:', error);
          didLogError = true;
        }
        return NaN;
      }
    })
  );

  return {
    type: 'surface',
    x: gridValues,
    y: gridValues,
    z,
    opacity,
    colorscale,
    showscale: false,
  };
};

export const createExplicitSurfaceDefinition = ({
  id,
  symbol,
  expression,
  gridValues,
  accent,
  opacity,
  colorscale,
}) => {
  const evaluator = createExplicitSurfaceEvaluator(expression);
  const plot = buildExplicitSurfacePlot({
    evaluator,
    gridValues,
    opacity,
    colorscale,
  });

  return {
    id,
    symbol,
    expression,
    label: `${symbol}(x, y) = ${expression}`,
    accent,
    opacity,
    colorscale,
    evaluator,
    plot,
  };
};
