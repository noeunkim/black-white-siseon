
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchInput() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            // Encode the query to handle Korean characters in URL
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
            <input
                type="text"
                placeholder="어떤 이슈가 궁금하신가요? (예: 원전 찬반, 노키즈존)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    fontSize: '1.1rem',
                    border: '2px solid var(--border-medium)',
                    borderRadius: '50px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--text-primary)';
                    e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-medium)';
                    e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                }}
            />
            <button
                type="submit"
                style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'var(--accent-black)',
                    color: 'var(--accent-white)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                aria-label="검색"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
        </form>
    );
}
