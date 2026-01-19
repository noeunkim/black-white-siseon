
import Link from 'next/link';
import { issues } from '@/lib/data';
import SearchInput from './components/SearchInput';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            흑백시선.
          </h1>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Daily Briefing
          </span>
        </div>
      </header>

      {/* Hero / Search Section */}
      <section style={{
        padding: '5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', fontWeight: 800 }}>
          세상의 모든 <br className="mobile-break" />
          <span style={{ color: 'var(--text-tertiary)' }}>이면을 탐색하다</span>
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          편향된 알고리즘에서 벗어나세요. 질문을 던지면, <br />
          <strong>흑백시선</strong>이 양측의 가장 강력한 논리를 찾아드립니다.
        </p>

        <SearchInput />

        <div style={{ marginTop: '3rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginRight: '0.5rem' }}>추천 키워드:</span>
          {['AI 규제', '원격 의료', '촉법소년', '의대 증원'].map(keyword => (
            <Link key={keyword} href={`/search?q=${encodeURIComponent(keyword)}`} style={{
              fontSize: '0.9rem',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)'
            }}>
              {keyword}
            </Link>
          ))}
        </div>
      </section>

      <div className="container" style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem' }}>
          <h2 className="section-title" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>오늘의 쟁점</h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>{new Date().toLocaleDateString('ko-KR')} 기준</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {issues.map((issue, index) => (
            <Link
              key={issue.id}
              href={`/issues/${issue.id}`}
              className="card animate-fade-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                animationDelay: `${index * 100}ms`
              }}
            >
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  background: 'var(--bg-secondary)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {issue.category}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  {issue.publishDate}
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: 1.25, wordBreak: 'keep-all' }}>
                {issue.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1, wordBreak: 'keep-all' }}>
                {issue.oneLineSummary}
              </p>

              <div style={{
                marginTop: 'auto',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <span>양측 의견 보기</span>
                <span style={{ transform: 'translateX(0)', transition: 'transform 0.2s' }}>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
