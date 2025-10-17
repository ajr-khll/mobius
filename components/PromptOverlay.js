import { useCallback } from 'react';

export default function PromptOverlay({
  isOpen,
  onToggle,
  promptValue,
  onPromptChange,
  onSubmit,
  onClear,
  functions,
  error,
}) {
  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit?.(promptValue);
    },
    [onSubmit, promptValue]
  );

  const handlePromptKeyDown = useCallback(
    (event) => {
      if (
        event.key === 'Enter'
        && !event.shiftKey
        && !event.ctrlKey
        && !event.altKey
        && !event.metaKey
      ) {
        event.preventDefault();
        onSubmit?.(promptValue);
      }
    },
    [onSubmit, promptValue]
  );

  return (
    <>
      <button
        type="button"
        className={`chat-circle${isOpen ? ' is-open' : ''}`}
        aria-pressed={isOpen}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close function prompt chat' : 'Open function prompt chat'}
        onClick={onToggle}
      >
        <span className="chat-circle-icon">+</span>
      </button>

      {isOpen && (
        <section
          className="chat-overlay-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Function prompt composer"
        >
          <header className="chat-overlay-header">
            <h2>Function Builder</h2>
            <p>
              Describe the surface you want to see. Provide an equation like{' '}
              <code>sin(x) * cos(y)</code> or request a concept such as
              &ldquo;quadratic bowl in 3D&rdquo;. Up to three explicit surfaces can
              be active at once.
            </p>
          </header>
          <form className="chat-overlay-form" onSubmit={handleFormSubmit}>
            <label className="sr-only" htmlFor="function-prompt">
              Function prompt
            </label>
            <textarea
              id="function-prompt"
              value={promptValue}
              onChange={(event) => onPromptChange?.(event.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="Example: gaussian peak centered at the origin"
              rows={4}
            />
            <div className="chat-overlay-actions">
              <button type="submit">Visualize</button>
              <button type="button" onClick={onClear}>
                Clear
              </button>
            </div>
            {error && (
              <p className="chat-overlay-error" role="alert">
                {error}
              </p>
            )}
          </form>

          <div className="chat-overlay-footer">
            <h3>Active functions</h3>
            <ul>
              {functions?.length ? (
                functions.map((fn) => (
                  <li key={fn.id}>
                    {fn.symbol}
                    :
                    {' '}
                    {fn.label}
                  </li>
                ))
              ) : (
                <li>No explicit surfaces are active.</li>
              )}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
