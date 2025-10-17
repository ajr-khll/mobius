import Head from 'next/head';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Workspace() {
  const axisFont = {
    family: 'JetBrains Mono, monospace',
    size: 12,
    color: '#93a5cc',
  };

  const surfaceData = [
    {
      type: 'surface',
      contours: {
        z: {
          show: true,
          usecolormap: true,
          highlightcolor: '#1b3f89',
          project: { z: true },
        },
      },
      colorscale: [
        [0, '#0a1430'],
        [0.35, '#14275c'],
        [0.7, '#1f3f8f'],
        [1, '#6f9ce5'],
      ],
      opacity: 0.95,
      z: [
        [0.5, 0.2, 0.1, 0],
        [0.2, 0.5, 0.8, 0.3],
        [0.1, 0.9, 1.4, 0.6],
        [0, 0.4, 0.7, 0.2],
      ],
    },
  ];

  const surfaceLayout = {
    autosize: true,
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      family: 'JetBrains Mono, monospace',
      color: '#edf3ff',
    },
    scene: {
      xaxis: {
        showgrid: false,
        zeroline: false,
        title: { text: 'X', font: axisFont },
        tickfont: axisFont,
      },
      yaxis: {
        showgrid: false,
        zeroline: false,
        title: { text: 'Y', font: axisFont },
        tickfont: axisFont,
      },
      zaxis: {
        showgrid: false,
        zeroline: false,
        title: { text: 'Z', font: axisFont },
        tickfont: axisFont,
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.1 },
      },
    },
  };

  return (
    <>
      <Head>
        <title>Workspace</title>
        <meta
          name="description"
          content="Interact with an LLM and preview data visualizations side by side."
        />
      </Head>
      <main className="app-shell">
        <section className="chat-panel">
          <header className="chat-header">
            <span className="chat-badge">LLM Session</span>
            <h1>Conversational Canvas</h1>
          </header>
          <div className="chat-history">
            <div className="message llm" aria-label="Example LLM response">
              <div className="message-line" />
              <div className="message-line short" />
            </div>
            <div className="message user" aria-label="Example user prompt">
              <div className="message-line" />
              <div className="message-line short" />
            </div>
          </div>
          <form className="chat-composer">
            <label htmlFor="prompt" className="sr-only">
              Prompt
            </label>
            <div className="composer-shell">
              <textarea
                id="prompt"
                rows={4}
                aria-label="Compose prompt"
                disabled
              />
            </div>
          </form>
        </section>
        <section className="graph-panel">
          <div className="graph-placeholder">
            <Plot
              data={surfaceData}
              layout={surfaceLayout}
              config={{
                displayModeBar: false,
                responsive: true,
              }}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler
            />
          </div>
        </section>
      </main>
    </>
  );
}
