import { useEffect, useRef } from 'react';

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

const escapeHtml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const getFunctionLabelLatex = (fn) => {
  if (!fn) {
    return '';
  }

  if (fn.inequality) {
    const { operator, expression } = fn.inequality;
    const latexOperator = operator === '>=' ? '\\\\geq' : '>';
    const suffix = operator === '>' ? '\\\\;\\\\text{(strict)}' : '';
    return `\\\\(z ${latexOperator} ${escapeHtml(expression)}${suffix}\\\\)`;
  }

  if (fn.expression) {
    return `\\(${escapeHtml(fn.symbol)}(x,\\, y) = ${escapeHtml(fn.expression)}\\)`;
  }

  if (fn.expressions) {
    const { x, y } = fn.expressions;
    return `\\(${escapeHtml(fn.symbol)}(t) = (${escapeHtml(x)},\\, ${escapeHtml(y)},\\, t)\\)`;
  }

  return fn.label ? `\\(${escapeHtml(fn.label)}\\)` : `\\(${escapeHtml(fn.symbol || '')}\\)`;
};

const typesetMath = (element) => {
  if (typeof window === 'undefined' || !element) {
    return;
  }

  const { MathJax } = window;
  if (!MathJax) {
    return;
  }

  const startupPromise = MathJax.startup?.promise || Promise.resolve();
  startupPromise
    .then(() => {
      if (MathJax.typesetPromise) {
        return MathJax.typesetPromise([element]);
      }
      if (MathJax.typeset) {
        MathJax.typeset([element]);
      }
      return null;
    })
    .catch(() => {});
};

export default function FunctionOverlay({ functions, expanded, onToggle }) {
  const containerRef = useRef(null);

  useEffect(() => {
    typesetMath(containerRef.current);
  }, [functions, expanded]);

  return (
    <aside
      className="function-overlay"
      aria-label="Active function descriptions"
      ref={containerRef}
    >
      {functions.map((fn) => {
        const { symbol, label, accent } = fn;
        const isExpanded = Boolean(expanded[symbol]);
        const labelId = `${symbol}-label`;
        const latexLabel = getFunctionLabelLatex(fn);
        const operatorSuffix = fn.inequality
          ? (fn.inequality.operator === '>=' ? '>=' : '>')
          : '';
        const circleLabel = operatorSuffix ? `${symbol}${operatorSuffix}` : symbol;

        return (
          <div
            key={symbol}
            className={`function-chip${isExpanded ? ' is-expanded' : ''}`}
            style={{
              '--accent-color': accent,
              '--accent-fill': hexToRgba(accent, 0.28),
              '--accent-fill-strong': hexToRgba(accent, 0.45),
              '--accent-border': hexToRgba(accent, 0.58),
            }}
          >
            {isExpanded && (
              <div
                id={labelId}
                className="function-label"
                role="status"
                dangerouslySetInnerHTML={{ __html: latexLabel }}
              />
            )}
            <button
              type="button"
              className="function-circle"
              aria-expanded={isExpanded}
              aria-controls={isExpanded ? labelId : undefined}
              aria-label={`${isExpanded ? 'Hide' : 'Show'} description for ${symbol}`}
              title={`${isExpanded ? 'Hide' : 'Show'} ${label || symbol}`}
              onClick={() => onToggle?.(symbol)}
            >
              {circleLabel}
            </button>
          </div>
        );
      })}
    </aside>
  );
}
