import * as math from 'mathjs';

const roundValue = (value, precision = 4) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return NaN;
  }
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const createParametricCurveDefinition = ({
  id,
  symbol,
  xExpression,
  yExpression,
  parameterRange,
  accent,
}) => {
  if (!xExpression || !yExpression) {
    throw new Error('Parametric curves require both x(t) and y(t) expressions.');
  }

  const { start, end, steps } = parameterRange || {};
  if (
    !Number.isFinite(start)
    || !Number.isFinite(end)
    || !Number.isInteger(steps)
    || steps < 2
  ) {
    throw new Error('Parametric curves require a valid parameter range with at least two steps.');
  }

  const xCode = math.compile(xExpression);
  const yCode = math.compile(yExpression);

  const stepSize = (end - start) / (steps - 1);
  const tValues = Array.from({ length: steps }, (_, index) => start + index * stepSize);

  const xValues = [];
  const yValues = [];
  const zValues = [];
  let didLogError = false;

  tValues.forEach((t) => {
    try {
      const scope = { t };
      const x = roundValue(Number(xCode.evaluate(scope)));
      const y = roundValue(Number(yCode.evaluate(scope)));

      xValues.push(x);
      yValues.push(y);
      zValues.push(roundValue(t));
    } catch (error) {
      if (!didLogError) {
        console.error('Failed to evaluate parametric curve point:', error);
        didLogError = true;
      }
      xValues.push(NaN);
      yValues.push(NaN);
      zValues.push(roundValue(t));
    }
  });

  return {
    id,
    symbol,
    label: `${symbol}(t) = (${xExpression}, ${yExpression}, t)`,
    accent,
    expressions: {
      x: xExpression,
      y: yExpression,
    },
    parameterRange: { start, end, steps },
    plot: {
      type: 'scatter3d',
      mode: 'lines',
      x: xValues,
      y: yValues,
      z: zValues,
      line: {
        color: accent,
        width: 4,
      },
      name: `${symbol}(t)`,
      showlegend: false,
      hovertemplate: 'x=%{x:.3f}<br>y=%{y:.3f}<br>t=%{z:.3f}<extra></extra>',
    },
  };
};
