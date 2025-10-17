import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const INITIAL_CHAT_MESSAGES = [
  {
    id: 'assistant-intro',
    role: 'assistant',
    text: 'Welcome! Ask what you would like to learn - algebra, calculus, geometry, or anything else. I will walk you through the steps, highlight the reasoning, and generate visual models on the graph whenever they help (and whenever you request them).',
  },
  {
    id: 'assistant-example',
    role: 'assistant',
    text: 'Example - Solve x^2 - 5x + 6 = 0:\n1. Factor to (x - 2)(x - 3) = 0.\n2. Set each factor equal to zero to get x = 2 and x = 3.\n3. Plot the parabola and mark the roots to confirm the solution.\nTry asking, "Teach me how to graph a sine wave step by step."',
  },
];

const DEFAULT_PANEL_WIDTH = 420;
const MIN_PANEL_WIDTH = 320;
const MAX_PANEL_WIDTH_RATIO = 0.5;

const chatOverlayPanelBaseStyle = {
  overflow: 'hidden',
  border: '1.5px solid rgba(255, 255, 255, 0.6)',
  background:
    'linear-gradient(180deg, rgba(10, 12, 20, 0.85) 0%, rgba(10, 12, 20, 0.85) 10%, rgba(10, 12, 20, 0.5) 10%, rgba(10, 12, 20, 0.5) 100%)',
};

const chatHistoryStyle = {
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.9rem',
  overflowY: 'auto',
  paddingRight: '0.35rem',
  width: '100%',
};

const messageWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  width: '100%',
};

const assistantMessageStyle = {
  alignSelf: 'flex-start',
  maxWidth: '100%',
  fontSize: '0.94rem',
  lineHeight: 1.6,
  color: 'var(--text-primary)',
  background: 'transparent',
  border: 'none',
  padding: 0,
  whiteSpace: 'pre-line',
};

const userBubbleStyle = {
  alignSelf: 'flex-end',
  maxWidth: '100%',
  borderRadius: '0.85rem',
  padding: '0.75rem 0.95rem',
  fontSize: '0.92rem',
  lineHeight: 1.55,
  background: 'rgba(30, 34, 45, 0.92)',
  border: '0.75px solid rgba(130, 138, 150, 0.5)',
  color: '#ffffff',
  whiteSpace: 'pre-line',
};

const composerRowStyle = {
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'flex-end',
  width: '100%',
};

const textareaStyle = {
  flex: '1 1 auto',
  width: '100%',
  border: '0.75px solid rgba(160, 166, 180, 0.35)',
  background: 'rgba(18, 22, 34, 0.82)',
  color: 'var(--text-primary)',
};

const sendButtonStyle = {
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: '50%',
  border: '0.75px solid rgba(170, 178, 195, 0.45)',
  background: 'rgba(170, 178, 195, 0.16)',
  color: '#AEB2C5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  cursor: 'pointer',
  flex: '0 0 auto',
  transition: 'border-color 160ms ease, background 160ms ease, color 160ms ease, transform 160ms ease',
};

const resizeHandleStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: '0.75rem',
  height: '100%',
  cursor: 'ew-resize',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
};

const resizeGripStyle = {
  width: '1.5px',
  height: '38%',
  borderRadius: '1px',
  background: 'rgba(255, 255, 255, 0.35)',
};

const mobiusLabelStyle = {
  position: 'absolute',
  top: 'clamp(1.2rem, 3.8vw, 2.4rem)',
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.4rem',
  letterSpacing: '0.18em',
  color: 'rgba(231, 236, 245, 0.82)',
  zIndex: 11,
  pointerEvents: 'none',
  userSelect: 'none',
  textAlign: 'center',
};

export default function PromptOverlay({
  isOpen,
  onToggle,
  promptValue,
  onPromptChange,
  onSubmit,
  error,
}) {
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const chatEndRef = useRef(null);
  const startPointerXRef = useRef(0);
  const startWidthRef = useRef(DEFAULT_PANEL_WIDTH);
  const isResizingRef = useRef(false);
  const pointerMoveHandlerRef = useRef(null);
  const pointerUpHandlerRef = useRef(null);
  const [isSendHovered, setIsSendHovered] = useState(false);

  const submitPrompt = useCallback(() => {
    const trimmed = promptValue.trim();

    if (trimmed) {
      setChatMessages((previous) => [
        ...previous,
        {
          id: `user-${Date.now()}`,
          role: 'user',
          text: trimmed,
        },
      ]);
    }

    onSubmit?.(promptValue);
  }, [onSubmit, promptValue]);

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault();
      submitPrompt();
    },
    [submitPrompt]
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
        submitPrompt();
      }
    },
    [submitPrompt]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const clampWidth = (width) => {
      const maxWidth = window.innerWidth * MAX_PANEL_WIDTH_RATIO;
      return Math.min(Math.max(width, MIN_PANEL_WIDTH), maxWidth);
    };

    setPanelWidth((current) => clampWidth(current));

    const handleWindowResize = () => {
      setPanelWidth((current) => clampWidth(current));
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (pointerMoveHandlerRef.current) {
        window.removeEventListener('pointermove', pointerMoveHandlerRef.current);
        pointerMoveHandlerRef.current = null;
      }
      if (pointerUpHandlerRef.current) {
        window.removeEventListener('pointerup', pointerUpHandlerRef.current);
        pointerUpHandlerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isOpen]);

  const handleResizeStart = useCallback(
    (event) => {
      if (typeof window === 'undefined') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      isResizingRef.current = true;
      startPointerXRef.current = event.clientX;
      startWidthRef.current = panelWidth;

      const handlePointerMove = (moveEvent) => {
        if (!isResizingRef.current) {
          return;
        }

        const delta = moveEvent.clientX - startPointerXRef.current;
        const maxWidth = window.innerWidth * MAX_PANEL_WIDTH_RATIO;
        const nextWidth = Math.min(
          Math.max(startWidthRef.current + delta, MIN_PANEL_WIDTH),
          maxWidth
        );

        setPanelWidth(nextWidth);
      };

      const handlePointerUp = () => {
        isResizingRef.current = false;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        pointerMoveHandlerRef.current = null;
        pointerUpHandlerRef.current = null;
      };

      pointerMoveHandlerRef.current = handlePointerMove;
      pointerUpHandlerRef.current = handlePointerUp;

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [panelWidth]
  );

  const panelStyle = {
    ...chatOverlayPanelBaseStyle,
    width: `${panelWidth}px`,
  };

  const sendButtonDynamicStyle = {
    ...sendButtonStyle,
    ...(isSendHovered
      ? {
          border: '0.75px solid rgba(232, 236, 245, 0.75)',
          background: 'rgba(231, 236, 245, 0.32)',
          color: '#ffffff',
          transform: 'translateY(-1px)',
        }
      : null),
  };

  return (
    <>
      <div style={mobiusLabelStyle}>mobius</div>
      <button
        type="button"
        className={`chat-circle${isOpen ? ' is-open' : ''}`}
        aria-pressed={isOpen}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close function prompt chat' : 'Open function prompt chat'}
        onClick={onToggle}
        style={{ color: '#ffffff', fontSize: '1.2rem' }}
      >
        <span className="chat-circle-icon" style={{ color: '#ffffff' }}>
          +
        </span>
      </button>

      {isOpen && (
        <section
          className="chat-overlay-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Function prompt composer"
          style={panelStyle}
        >
          <div
            style={resizeHandleStyle}
            onPointerDown={handleResizeStart}
            role="presentation"
            aria-hidden="true"
          >
            <div style={resizeGripStyle} />
          </div>

          <div className="chat-history" style={chatHistoryStyle}>
            {chatMessages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...messageWrapperStyle,
                  alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={
                    message.role === 'user' ? userBubbleStyle : assistantMessageStyle
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-overlay-form" onSubmit={handleFormSubmit}>
            <label className="sr-only" htmlFor="function-prompt">
              Function prompt
            </label>
            <div style={composerRowStyle}>
              <textarea
                id="function-prompt"
                value={promptValue}
                onChange={(event) => onPromptChange?.(event.target.value)}
                onKeyDown={handlePromptKeyDown}
                placeholder="What would you like to learn today?"
                rows={4}
                style={textareaStyle}
                aria-label="Learning prompt"
              />
              <button
                type="submit"
                aria-label="Send message"
                style={sendButtonDynamicStyle}
                onMouseEnter={() => setIsSendHovered(true)}
                onMouseLeave={() => setIsSendHovered(false)}
              >
                ↑
              </button>
            </div>
            {error && (
              <p className="chat-overlay-error" role="alert">
                {error}
              </p>
            )}
          </form>
        </section>
      )}
    </>
  );
}
