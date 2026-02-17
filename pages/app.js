import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Analytics } from "@vercel/analytics/next"

import FunctionOverlay from '../components/FunctionOverlay';
import PromptOverlay from '../components/PromptOverlay';

import { createExplicitSurfaceDefinition } from '../lib/explicitSurfaces';
import { createParametricCurveDefinition } from '../lib/parametricSurfaces';
import { GRID_VALUES } from '../lib/grid';
import { EXPLICIT_SURFACE_STYLES, MAX_EXPLICIT_SURFACES } from '../lib/surfaceStyles';
import { chooseCamera, animateCamera } from '../lib/camera';
import { createInequalityRegionDefinition } from '../lib/inequalityRegions';
import coloredLogo from '../assets/mobius_logo@2x.png';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const resolveBackendBaseUrl = () => {
  const envValue = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (envValue) {
    return envValue.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    const fallbackPort = isLocalHost ? '8000' : port;
    const portSegment = fallbackPort ? `:${fallbackPort}` : '';
    return `${protocol}//${hostname}${portSegment}`;
  }

  return '';
};

const buildBackendUrl = (path = '') => {
  const baseUrl = resolveBackendBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!baseUrl) {
    return normalizedPath;
  }
  return `${baseUrl}${normalizedPath}`;
};

const PARAMETRIC_STYLE_SEQUENCE = ['#F5E663', '#9EDDEB', '#FF9CEE'];
const INEQUALITY_STYLE_SEQUENCE = ['#67C5FF', '#F2A93B', '#EA6F8F', '#7BE495'];

const axisFont = {
  family: 'JetBrains Mono, monospace',
  size: 12,
  color: '#93a5cc',
};

const layout = {
  autosize: true,
  margin: { l: 0, r: 0, t: 0, b: 0 },
  paper_bgcolor: '#020309',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: {
    family: 'JetBrains Mono, monospace',
    color: '#edf3ff',
  },
  scene: {
    xaxis: {
      showspikes: false,
      showgrid: false,
      zeroline: false,
      title: { text: 'X', font: axisFont },
      tickfont: axisFont,
    },
    yaxis: {
      showspikes: false,
      showgrid: false,
      zeroline: false,
      title: { text: 'Y', font: axisFont },
      tickfont: axisFont,
    },
    zaxis: {
      showspikes: false,
      showgrid: false,
      zeroline: false,
      title: { text: 'Z', font: axisFont },
      tickfont: axisFont,
    },
  },
};

const createDefaultAxisConfig = () => ({
  x: { mode: 'auto', min: -10, max: 10 },
  y: { mode: 'auto', min: -10, max: 10 },
  z: { mode: 'auto', min: -10, max: 10 },
});

export default function FullscreenPlot() {
  const [expandedFunctions, setExpandedFunctions] = useState({});
  const [surfaceSlots, setSurfaceSlots] = useState(
    () => Array(MAX_EXPLICIT_SURFACES).fill(null)
  );
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [promptError, setPromptError] = useState(null);
  const [latestAgentMessage, setLatestAgentMessage] = useState(null);
  const [isPromptSubmitting, setIsPromptSubmitting] = useState(false);
  const axisConfig = createDefaultAxisConfig();
  const nextReplacementIndexRef = useRef(0);
  const [parametricFunctions, setParametricFunctions] = useState([]);
  const parametricCounterRef = useRef(0);
  const [inequalityRegions, setInequalityRegions] = useState([]);
  const inequalityCounterRef = useRef(0);
  const clearButtonRef = useRef(null);
  const explicitFunctions = surfaceSlots.filter(Boolean);
  const activeFunctions = [
    ...parametricFunctions,
    ...explicitFunctions,
    ...inequalityRegions,
  ];
  const plotRef = useRef(null);
  const cameraAzimuthRef = useRef(0);
  const sessionIdRef = useRef(null);

  if (typeof crypto !== 'undefined' && !sessionIdRef.current) {
    sessionIdRef.current = crypto.randomUUID();
  }

  useEffect(() => {
    const gd = plotRef.current?.el;
    if (!gd) return;

    if (activeFunctions.length === 0) {
      animateCamera(gd, { eye: { x: 1.6, y: 1.6, z: 1.1 } });
      cameraAzimuthRef.current = 0;
      return;
    }

    const { camera: newCamera, azimuth } = chooseCamera(
      activeFunctions,
      GRID_VALUES,
      cameraAzimuthRef.current
    );
    cameraAzimuthRef.current = azimuth;
    animateCamera(gd, newCamera);
  }, [activeFunctions]);

  const addExplicitSurfaceFromExpression = useCallback(
    (expression) => {
      if (!expression) {
        return;
      }

      try {
        setSurfaceSlots((previous) => {
          const updated = [...previous];
          let targetIndex = previous.findIndex((slot) => slot === null);

          if (targetIndex === -1) {
            targetIndex = nextReplacementIndexRef.current;
          }

          const style = EXPLICIT_SURFACE_STYLES[targetIndex];
          const surfaceDefinition = createExplicitSurfaceDefinition({
            id: `explicit-${style.symbol}`,
            symbol: style.symbol,
            expression,
            gridValues: GRID_VALUES,
            accent: style.accent,
            opacity: style.opacity,
            colorscale: style.colorscale,
          });

          nextReplacementIndexRef.current = (targetIndex + 1) % MAX_EXPLICIT_SURFACES;

          updated[targetIndex] = {
            ...surfaceDefinition,
            styleIndex: targetIndex,
          };

          return updated;
        });
      } catch (error) {
        console.debug('Prompt was not interpreted as an explicit surface expression:', error);
      }
    },
    [setSurfaceSlots]
  );

  const addParametricCurveFromPayload = useCallback(
    (payload) => {
      if (!payload) {
        return;
      }

      const { x_expr, y_expr, t_range } = payload;
      if (!x_expr || !y_expr) {
        return;
      }

      const rangeArray = Array.isArray(t_range) ? t_range : [];
      const [rawStart, rawEnd, rawSteps] = rangeArray;
      const start = Number.isFinite(rawStart) ? rawStart : -Math.PI;
      let end = Number.isFinite(rawEnd) ? rawEnd : Math.PI;
      if (end === start) {
        end = start + 1;
      }
      const steps = Number.isFinite(rawSteps) && rawSteps > 1
        ? Math.floor(rawSteps)
        : 250;

      const currentIndex = parametricCounterRef.current;
      const symbol = `p${currentIndex + 1}`;
      const colorIndex = currentIndex % PARAMETRIC_STYLE_SEQUENCE.length;
      const accent = PARAMETRIC_STYLE_SEQUENCE[colorIndex];

      let definition;
      try {
        definition = createParametricCurveDefinition({
          id: `parametric-${symbol}-${Date.now().toString(36)}`,
          symbol,
          xExpression: x_expr,
          yExpression: y_expr,
          parameterRange: {
            start,
            end,
            steps,
          },
          accent,
        });
      } catch (error) {
        console.error('Failed to create parametric surface from tool payload:', error);
        return;
      }

      parametricCounterRef.current = currentIndex + 1;
      setParametricFunctions((previous) => [...previous, definition]);
    },
    [setParametricFunctions]
  );

  const addPlanarSurfaceFromPayload = useCallback(
    (payload) => {
      if (!payload) {
        return;
      }

      const { a = 0, b = 0, c = 1, d = 0 } = payload;
      if (!Number.isFinite(c) || c === 0) {
        console.warn('Received unsupported plane with c=0; skipping render.', payload);
        return;
      }

      const expression = `(-(${a}) * x - (${b}) * y - (${d})) / (${c})`;
      addExplicitSurfaceFromExpression(expression);
    },
    [addExplicitSurfaceFromExpression]
  );

  const addInequalityRegionFromPayload = useCallback(
    (payload) => {
      if (!payload) {
        return;
      }

      const { expression, operator, x_range, y_range, z_range } = payload;
      if (!expression) {
        return;
      }

      const currentIndex = inequalityCounterRef.current;
      const symbol = `r${currentIndex + 1}`;
      const colorIndex = currentIndex % INEQUALITY_STYLE_SEQUENCE.length;
      const accent = INEQUALITY_STYLE_SEQUENCE[colorIndex];

      try {
        const definition = createInequalityRegionDefinition({
          id: `inequality-${symbol}-${Date.now().toString(36)}`,
          symbol,
          expression,
          operator,
          accent,
          xRange: x_range,
          yRange: y_range,
          zRange: z_range,
        });

        inequalityCounterRef.current = currentIndex + 1;
        setInequalityRegions((previous) => [...previous, definition]);
      } catch (error) {
        console.error('Failed to create inequality region:', error);
      }
    },
    []
  );

  const handleToolEvents = useCallback(
    (events) => {
      if (!Array.isArray(events) || events.length === 0) {
        return;
      }

      events.forEach((event) => {
        if (!event || !event.tool) {
          return;
        }

        const payload = event.payload || event.result || {};

        switch (event.tool) {
          case 'plot_explicit_function':
            addExplicitSurfaceFromExpression(payload.expr || payload.expression);
            break;
          case 'plot_parametric_function':
            addParametricCurveFromPayload(payload);
            break;
          case 'plot_planar_function':
            addPlanarSurfaceFromPayload(payload);
            break;
          case 'plot_inequality_region':
            addInequalityRegionFromPayload(payload);
            break;
          default:
            break;
        }
      });
    },
    [
      addExplicitSurfaceFromExpression,
      addParametricCurveFromPayload,
      addPlanarSurfaceFromPayload,
      addInequalityRegionFromPayload,
    ]
  );

  const toggleFunction = (symbol) => {
    setExpandedFunctions((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  };

  const handlePromptToggle = () => {
    setIsPromptOpen((prev) => !prev);
    setPromptError(null);
  };

  const handlePromptSubmit = async (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setPromptError('Enter a prompt to send to the assistant.');
      return;
    }

    setPromptError(null);
    setIsPromptSubmitting(true);
    setLatestAgentMessage(null);

    try {
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        console.warn(
          'NEXT_PUBLIC_BACKEND_URL is not set; defaulting to inferred backend URL.'
        );
      }

      const response = await fetch(buildBackendUrl('/conversation/user-input'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, session_id: sessionIdRef.current }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (parseError) {
        console.warn('Unable to parse response from backend:', parseError);
      }

      if (!response.ok) {
        const detail =
          (data && (data.detail || data.error || data.message)) ||
          `Request failed with status ${response.status}`;
        throw new Error(detail);
      }

      const assistantReply =
        (data && (data.response || data.text)) || 'Assistant responded with no message.';

      handleToolEvents(Array.isArray(data?.tool_calls) ? data.tool_calls : []);

      setLatestAgentMessage({
        id: `assistant-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 6)}`,
        text: assistantReply,
      });
      setPromptValue('');
    } catch (error) {
      console.error('Failed to contact backend:', error);
      setPromptError(
        error instanceof Error
          ? error.message
          : 'Unable to contact the assistant. Please try again.'
      );
    } finally {
      setIsPromptSubmitting(false);
    }
  };

  const handleClearAll = useCallback(() => {
    setSurfaceSlots(Array(MAX_EXPLICIT_SURFACES).fill(null));
    setParametricFunctions([]);
    parametricCounterRef.current = 0;
    setInequalityRegions([]);
    inequalityCounterRef.current = 0;
    setExpandedFunctions({});
  }, []);

  const computedLayout = useMemo(() => {
    const baseScene = layout.scene || {};
    const scene = {
      ...baseScene,
      xaxis: { ...baseScene.xaxis },
      yaxis: { ...baseScene.yaxis },
      zaxis: { ...baseScene.zaxis },
    };

    (['x', 'y', 'z']).forEach((axisKey) => {
      const axisName = `${axisKey}axis`;
      const settings = axisConfig[axisKey];
      const currentAxis = scene[axisName] || {};

      if (settings?.mode === 'manual') {
        scene[axisName] = {
          ...currentAxis,
          autorange: false,
          range: [settings.min, settings.max],
        };
      } else {
        const { range, ...rest } = currentAxis;
        scene[axisName] = {
          ...rest,
          autorange: true,
        };
      }
    });

    return {
      ...layout,
      scene,
    };
  }, [axisConfig]);

  return (
    <>
      <Head>
        <title>Mobius Viewport</title>
        <meta name="description" content="Full-screen Plotly surface preview." />
      </Head>
      <Analytics />
      <div className="fullscreen-plot">
        <button
          type="button"
          className="clear-plot-button"
          aria-label="Clear all plots"
          onClick={handleClearAll}
          ref={clearButtonRef}
        >
          Clear
        </button>

        <Link
          href="/apple"
          className="mobius-logo-link"
          aria-label="Explore the Mobius experience"
        >
          <Image
            src={coloredLogo}
            alt="Mobius colored logo"
            width={64}
            height={64}
            priority
            className="mobius-logo-image"
          />
        </Link>
        <Plot
          ref={plotRef}
          data={activeFunctions.flatMap((definition) => {
            const plots = [];
            if (definition.plot) {
              plots.push(definition.plot);
            }
            if (Array.isArray(definition.auxiliaryPlots)) {
              plots.push(...definition.auxiliaryPlots);
            }
            return plots;
          })}
          layout={computedLayout}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          onInitialized={(figure, graphDiv) => { plotRef.current = graphDiv; }}
          onUpdate={(figure, graphDiv) => { plotRef.current = graphDiv; }}
        />
        <FunctionOverlay
          functions={activeFunctions}
          expanded={expandedFunctions}
          onToggle={toggleFunction}
        />
        <PromptOverlay
          isOpen={isPromptOpen}
          onToggle={handlePromptToggle}
          promptValue={promptValue}
          onPromptChange={setPromptValue}
          onSubmit={handlePromptSubmit}
          error={promptError}
          isSubmitting={isPromptSubmitting}
          latestResponse={latestAgentMessage}
        />
      </div>
    </>
  );
}
