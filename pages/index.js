import Head from 'next/head';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const data = [
  {
    type: 'surface',
    colorscale: [
      [0, '#081020'],
      [0.35, '#0f1f42'],
      [0.7, '#1b3f89'],
      [1, '#6f9ce5'],
    ],
    opacity: 0.97,
    z: [
      [0.5, 0.2, 0.1, 0],
      [0.2, 0.5, 0.8, 0.3],
      [0.1, 0.9, 1.4, 0.6],
      [0, 0.4, 0.7, 0.2],
    ],
  },
];

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
    camera: { eye: { x: 1.6, y: 1.6, z: 1.1 } },
  },
};

export default function FullscreenPlot() {
  return (
    <>
      <Head>
        <title>Mobius Viewport</title>
        <meta name="description" content="Full-screen Plotly surface preview." />
      </Head>
      <div className="fullscreen-plot">
        <Plot
          data={data}
          layout={layout}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
    </>
  );
}
