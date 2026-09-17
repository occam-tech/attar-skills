import React from 'react';
import { render } from 'react-dom';
import './app.css';

type Row = { id: number; name: string; done: boolean };

function App() {
  const [rows, setRows] = React.useState<Row[]>([
    { id: 1, name: 'first', done: false },
    { id: 2, name: 'second', done: true },
  ]);
  const [text, setText] = React.useState('hello');
  const [w, setW] = React.useState(0);
  const boxRef = React.useRef<any>(null);

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (boxRef.current) setW(Math.round(boxRef.current.getBoundingClientRect().width));
    }, 50);
    return () => clearTimeout(t);
  }, []);

  return <main className="page">
    <h1 style={{ color: '#c9780a', marginBottom: '8px' }}>Probe</h1>
    <p className="muted">width: {w}px</p>

    <div ref={boxRef} className="box">
      <label htmlFor="name">Name</label>
      <input id="name" type="text" value={text} onChange={e => setText((e.target as any).value)} />
      <button type="button" onClick={() => setRows(r => [...r, { id: r.length + 1, name: text, done: false }])}>
        Add
      </button>
    </div>

    <table>
      <thead><tr><th>id</th><th>name</th><th>done</th></tr></thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td><input type="checkbox" checked={row.done}
              onChange={() => setRows(rs => rs.map(x => x.id === row.id ? { ...x, done: !x.done } : x))} /></td>
          </tr>
        ))}
      </tbody>
    </table>

    <svg width="60" height="24" viewBox="0 0 60 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="24" rx="4" fill="#2a8f6e" />
    </svg>
  </main>;
}

render(<App />, document.getElementById('app'));
