import * as cheerio from 'cheerio';

export interface ScrapedArticle {
    title: string;
    content: string;
    source: string;
    url: string;
}

const SOURCE_MAP: Record<string, string> = {
    'chosun.com': '조선일보',
    'donga.com': '동아일보',
    'joongang.co.kr': '중앙일보',
    'hani.co.kr': '한겨레',
    'khan.co.kr': '경향신문',
    'kmib.co.kr': '국민일보',
    'mk.co.kr': '매일경제',
    'mt.co.kr': '머니투데이',
    'sedaily.com': '서울경제',
    'hankyung.com': '한국경제',
    'yonhapnews.co.kr': '연합뉴스',
    'yna.co.kr': '연합뉴스',
    'news.kbs.co.kr': 'KBS',
    'imnews.imbc.com': 'MBC',
    'news.sbs.co.kr': 'SBS',
    'jtbc.co.kr': 'JTBC',
    'newsis.com': '뉴시스',
    'news1.kr': '뉴스1',
    'hankookilbo.com': '한국일보',
    'segye.com': '세계일보',
    'nocutnews.co.kr': '노컷뉴스',
    'ohmynews.com': '오마이뉴스',
    'pressian.com': '프레시안',
    'munhwa.com': '문화일보',
    'news.naver.com': '네이버뉴스',
    'n.news.naver.com': '네이버뉴스',
};

export function extractSource(url: string): string {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        return SOURCE_MAP[hostname] || hostname;
    } catch {
        return 'Unknown';
    }
}

export async function scrapeArticle(url: string): Promise<ScrapedArticle | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        $('script, style, nav, header, footer, aside, .ad, .ads, .advertisement, .banner, .comment, .comments, .related, .recommend').remove();

        let title = '';
        const titleSelectors = [
            'meta[property="og:title"]',
            'h1.article-title',
            'h1.news-title',
            'h1.title',
            'h1',
            'title',
        ];

        for (const selector of titleSelectors) {
            const el = $(selector);
            if (el.length) {
                title = selector.startsWith('meta') ? el.attr('content') || '' : el.first().text();
                title = title.trim();
                if (title) break;
            }
        }

        let content = '';
        const contentSelectors = [
            'article',
            '.article-body',
            '.article-content',
            '.news-content',
            '.news-article',
            '.article_body',
            '.newsct_article',
            '#articleBody',
            '#newsct_article',
            '#article-view-content-div',
            '.view_article',
            '#articeBody',
            '.article_txt',
            '[itemprop="articleBody"]',
            'main',
        ];

        for (const selector of contentSelectors) {
            const el = $(selector);
            if (el.length) {
                content = el.first().text();
                content = cleanContent(content);
                if (content.length > 200) break;
            }
        }

        if (content.length < 200) {
            content = $('body').text();
            content = cleanContent(content);
        }

        if (!title || content.length < 100) {
            return null;
        }

        return {
            title,
            content: content.slice(0, 8000),
            source: extractSource(url),
            url,
        };
    } catch (error) {
        console.error('Scrape error:', error);
        return null;
    }
}

function cleanContent(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .replace(/[^\S\n]+/g, ' ')
        .split('\n')
        .map(line => line.trim())
        .filter(line => {
            if (line.length < 15) return false;
            if (/^(공유|댓글|좋아요|구독|알림|로그인|회원가입)/.test(line)) return false;
            if (/^(이전기사|다음기사|관련기사|추천기사|인기기사)/.test(line)) return false;
            if (/copyright|저작권|무단전재/i.test(line)) return false;
            return true;
        })
        .join('\n')
        .trim();
}
