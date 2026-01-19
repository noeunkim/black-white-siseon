
import Link from 'next/link';
import Image from 'next/image';
import { issues } from '@/lib/data';
import { notFound } from 'next/navigation';

// Next.js 15 handling of params as a Promise
type Props = {
    params: Promise<{ id: string }>;
};

export default async function IssueDetail({ params }: Props) {
    const { id } = await params;
    const issue = issues.find((i) => i.id === id);

    if (!issue) {
        notFound();
    }

    return (
        <div className="min-h-screen pb-20">
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
                    <Link href="/" style={{ fontSize: '1.25rem', marginRight: '1rem' }}>
                        &larr;
                    </Link>
                    <span style={{ fontWeight: 600, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {issue.title}
                    </span>
                </div>
            </header>

            <article className="container animate-fade-in" style={{ marginTop: '2rem' }}>
                {/* Header Section */}
                <section style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
                    <span style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        background: 'var(--bg-secondary)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        marginBottom: '1rem'
                    }}>
                        {issue.category}
                    </span>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                        {issue.title}
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {issue.coreSummary}
                    </p>
                </section>

                {/* Representative Image */}
                {issue.imageUrl && (
                    <div style={{ marginBottom: '3rem', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                        <Image
                            src={issue.imageUrl}
                            alt={issue.title}
                            width={800}
                            height={400}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            priority
                        />
                    </div>
                )}

                {/* Two Sides */}
                <div className="perspective-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '2rem',
                    alignItems: 'start'
                }}>

                    {/* PRO */}
                    <div className="perspective-col pro" style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            paddingBottom: '1rem',
                            marginBottom: '1.5rem',
                            borderBottom: '2px solid #000',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            찬성 측 논리
                            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>PRO</span>
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {issue.proPerspective.points.map((point, idx) => (
                                <div key={idx}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{point.headline}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{point.description}</p>
                                    {point.references && point.references.length > 0 && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            {point.references.map((ref, rIdx) => (
                                                <a key={rIdx} href={ref.url} style={{ fontSize: '0.8rem', textDecoration: 'underline', color: 'var(--text-tertiary)' }}>
                                                    관련 기사
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CON */}
                    <div className="perspective-col con" style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            paddingBottom: '1rem',
                            marginBottom: '1.5rem',
                            borderBottom: '2px solid #999',
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: 'var(--text-secondary)' // Slightly structured difference
                        }}>
                            반대 측 논리
                            <span style={{ fontSize: '1rem', fontWeight: 400 }}>CON</span>
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {issue.conPerspective.points.map((point, idx) => (
                                <div key={idx}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{point.headline}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{point.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Neutral Meta */}
                {issue.neutralMeta && (
                    <section style={{
                        marginTop: '3rem',
                        padding: '2rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius)',
                        borderLeft: '4px solid var(--text-tertiary)'
                    }}>
                        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 700 }}>
                            중립적 관점 (Meta View)
                        </h3>
                        <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                            {issue.neutralMeta}
                        </p>
                    </section>
                )}

                {/* Feedback Mock */}
                <section style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>당신의 생각은 어떤가요?</h3>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <button className="btn btn-outline" style={{ minWidth: '100px' }}>동의</button>
                        <button className="btn btn-outline" style={{ minWidth: '100px' }}>중립</button>
                        <button className="btn btn-outline" style={{ minWidth: '100px' }}>반대</button>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                        중립성 평점: {issue.feedback.neutralityScore} / 5.0 • {issue.feedback.commentCount}개의 의견
                    </p>
                </section>

            </article>
        </div>
    );
}
