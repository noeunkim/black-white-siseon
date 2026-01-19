import { getAllSearches } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const searches = getAllSearches();
        return NextResponse.json(searches);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
