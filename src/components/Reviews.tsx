import { S, type Settings, type Lang } from '@/lib/util';

export default function Reviews({ reviews, settings, lang, t, id = 'reviews', bg }: { reviews: any[]; settings: Settings; lang: Lang; t: any; id?: string; bg?: string }) {
  if (!reviews.length) return null;
  const rating = S(settings, 'rating', 'en');
  const count = S(settings, 'review_count', 'en');
  const url = S(settings, 'google_review_url', 'en');
  return (
    <section id={id} className={`section ${bg ?? ''}`}>
      <div className="container">
        <div className="row between" style={{ marginBottom: 28, alignItems: 'flex-end' }}>
          <h2>{t.title}</h2>
          {rating && (
            <a href={url || undefined} className="card row" style={{ padding: '12px 18px', gap: 14, textDecoration: 'none' }}>
              <span style={{ fontSize: 26, fontWeight: 700 }}>{rating}</span>
              <span><span className="stars" aria-hidden="true" style={{ display: 'block' }}>★★★★★</span><span className="muted" style={{ fontSize: 13 }}>{t.onGoogle}{count ? ` · ${count} ${t.count}` : ''}</span></span>
            </a>
          )}
        </div>
        <div className="grid g-wide">
          {reviews.slice(0, 6).map((r) => (
            <figure key={r.id} className="card stack" style={{ margin: 0, gap: 14 }}>
              <div className="stars" role="img" aria-label={`${r.rating} / 5`}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>{r.text}</blockquote>
              <figcaption style={{ fontSize: 14 }}><b>{r.name}</b>{r.route ? <><br /><span className="muted">{r.route}</span></> : null}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
