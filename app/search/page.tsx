
"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';

// Wrap the actual search logic in a component that uses useSearchParams
function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    // Status: 'initializing' | 'researching' | 'analyzing' | 'complete'
    const [status, setStatus] = useState<string>('initializing');
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    // Simulation Effect
    useEffect(() => {
        if (!query) return;

        const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

        setStatus('initializing');
        setProgress(10);
        addLog(`"${query}" 주제어 분석 중...`);

        const t1 = setTimeout(() => {
            setStatus('researching');
            setProgress(40);
            addLog("주요 뉴스 및 소셜 미디어 데이터 수집 중...");
        }, 1500);

        const t2 = setTimeout(() => {
            addLog("전문가 의견 및 학술 자료 크로스체크...");
            setProgress(60);
        }, 3000);

        const t3 = setTimeout(() => {
            setStatus('analyzing');
            setProgress(80);
            addLog("찬성/반대 논거 추출 및 중립성 검증 중...");
        }, 5000);

        const t4 = setTimeout(() => {
            setStatus('complete');
            setProgress(100);
            addLog("리포트 생성 완료.");
        }, 7000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [query]);

    if (!query) {
        return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>검색어가 없습니다.</div>;
    }

    return (
        <div style={{ minHeight: '80vh' }}>
            {status !== 'complete' ? (
                <div className="container" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                        {status === 'initializing' && '주제를 분석하고 있습니다'}
                        {status === 'researching' && '다양한 관점을 수집 중입니다'}
                        {status === 'analyzing' && '논리를 구조화하고 있습니다'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        잠시만 기다려주세요. 치우치지 않는 정보를 찾고 있습니다.
                    </p>

                    <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'var(--accent-black)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>

                    <div style={{
                        textAlign: 'left',
                        background: 'var(--bg-secondary)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius)',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        height: '200px',
                        overflowY: 'auto'
                    }}>
                        {logs.map((log, i) => (
                            <div key={i} style={{ marginBottom: '0.5rem' }}>&gt; {log}</div>
                        ))}
                        <div className="animate-pulse">_</div>
                    </div>
                </div>
            ) : (
                <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
                    <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AI Research Report</span>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>{query}</h1>
                    </div>

                    <div className="perspective-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '2rem',
                        alignItems: 'start'
                    }}>
                        {/* MOCK RESULT: PRO */}
                        <div className="perspective-col pro" style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius)',
                            padding: '2rem'
                        }}>
                            <h2 style={{ borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                주요 찬성 논리 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>PRO</span>
                            </h2>
                            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <li>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>경제적/효율적 측면의 이점</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                                        해당 정책/기술의 도입이 비용을 절감하거나 기존 시스템의 비효율을 획기적으로 개선합니다.
                                    </p>
                                </li>
                                <li>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>사회적 안전망 강화</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                                        다수의 시민들에게 혜택이 돌아가며, 장기적으로 사회적 비용을 줄이는 효과가 있습니다.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* MOCK RESULT: CON */}
                        <div className="perspective-col con" style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius)',
                            padding: '2rem'
                        }}>
                            <h2 style={{ borderBottom: '2px solid #999', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                주요 반대 논리 <span style={{ fontSize: '1rem' }}>CON</span>
                            </h2>
                            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <li>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>우려되는 부작용과 위험</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                                        초기 의도와 달리 예상치 못한 사회적, 윤리적 문제를 야기할 가능성이 큽니다.
                                    </p>
                                </li>
                                <li>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>시기상조 및 준비 부족</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                                        아직 충분한 사회적 합의나 기술적 검증이 이루어지지 않아 도입 시 혼란이 예상됩니다.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>💡 중립적 요약 (Meta-view)</h3>
                        <p style={{ color: 'var(--text-primary)' }}>
                            현재 <strong>{query}</strong>에 대한 논의는 아직 진행 중입니다. 양측은 모두 타당한 근거를 가지고 있으며, 특정 관점만 수용하기보다는 상황에 맞는 유연한 접근이 필요합니다.
                        </p>
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button className="btn btn-outline" onClick={() => window.location.reload()}>다시 검색하기</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
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
                    <span style={{ fontWeight: 600 }}>탐색 결과</span>
                </div>
            </header>

            <Suspense fallback={<div className="container" style={{ padding: '2rem' }}>Loading...</div>}>
                <SearchResults />
            </Suspense>
        </main>
    );
}
