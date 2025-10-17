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

export default function FunctionOverlay({ functions, expanded, onToggle }) {
  return (
    <aside className="function-overlay" aria-label="Active function descriptions">
      {functions.map(({ symbol, label, accent }) => {
        const isExpanded = Boolean(expanded[symbol]);
        const labelId = `${symbol}-label`;

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
              <div id={labelId} className="function-label" role="status">
                {label}
              </div>
            )}
            <button
              type="button"
              className="function-circle"
              aria-expanded={isExpanded}
              aria-controls={isExpanded ? labelId : undefined}
              aria-label={`${isExpanded ? 'Hide' : 'Show'} description for ${symbol}`}
              title={`${isExpanded ? 'Hide' : 'Show'} ${label}`}
              onClick={() => onToggle?.(symbol)}
            >
              {symbol}
            </button>
          </div>
        );
      })}
    </aside>
  );
}
