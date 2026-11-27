'use client';
import { useState } from 'react';

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ borderTop: '1px solid var(--line)' }}>
      {items.map((f, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
          <button type="button" className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{f.q}</span>
            <span aria-hidden="true" style={{ fontSize: 24, color: 'var(--link)', flex: '0 0 auto' }}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <p className="muted" style={{ margin: '0 0 22px', fontSize: 15, lineHeight: 1.7 }}>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
