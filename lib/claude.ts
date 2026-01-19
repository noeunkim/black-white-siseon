import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY || 'missing-key-for-build';
const anthropic = new Anthropic({
  apiKey,
});

export interface AnalyzedArticle {
  title: string;
  url: string;
  source: string;
  summary: string;
  stance: 'pro' | 'con';
  keyPoint: string;
}

export interface OriginalAnalysis {
  title: string;
  topic: string;
  stance: 'pro' | 'con' | 'neutral';
  summary: string;
  keyPoints: string[];
}

export interface AnalysisResult {
  topic: string;
  originalAnalysis: OriginalAnalysis;
  proArticles: AnalyzedArticle[];
  conArticles: AnalyzedArticle[];
  balancedSummary: string;
}

export interface SearchQueryAnalysis {
  topic: string;
  originalStance: 'pro' | 'con' | 'neutral';
  stanceDescription: string;
  supportingSearchQuery: string;
  opposingSearchQuery: string;
}

interface TavilyResultInput {
  title: string;
  url: string;
  content: string;
  published_date?: string;
}

export async function analyzeAndGenerateSearchQueries(
  content: string
): Promise<SearchQueryAnalysis> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `콘텐츠를 분석하여 검색 쿼리를 생성하세요.

[콘텐츠]
${content.slice(0, 2000)}

JSON 형식으로 응답:
{
  "topic": "핵심 주제 (3-5단어, 검색용)",
  "originalStance": "pro/con/neutral",
  "stanceDescription": "입장 설명 (한 문장)",
  "supportingSearchQuery": "같은 입장 검색어 (20자 이내)",
  "opposingSearchQuery": "반대 입장 검색어 (20자 이내)"
}

지침:
- 비판 콘텐츠 → originalStance: "con"
- 옹호 콘텐츠 → originalStance: "pro"
- 검색어는 반드시 20자 이내로 간결하게
- 예: "쿠팡 대표 옹호 해명", "쿠팡 대표 비판 논란"

JSON만 출력:`,
      },
    ],
  });

  const textContent = response.content[0];
  if (textContent.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse search query JSON');
  }

  const result = JSON.parse(jsonMatch[0]) as SearchQueryAnalysis;

  result.supportingSearchQuery = result.supportingSearchQuery.slice(0, 50);
  result.opposingSearchQuery = result.opposingSearchQuery.slice(0, 50);
  result.topic = result.topic.slice(0, 30);

  return result;
}

export async function extractTopicFromContent(content: string): Promise<string> {
  const analysis = await analyzeAndGenerateSearchQueries(content);
  return analysis.topic;
}

export async function analyzeNewsWithClaude(
  userInput: string,
  originalContent: string | null,
  supportingResults: TavilyResultInput[],
  opposingResults: TavilyResultInput[],
  originalStance?: 'pro' | 'con' | 'neutral'
): Promise<AnalysisResult> {
  const originalSection = originalContent
    ? `
[원문 콘텐츠]
${originalContent.slice(0, 3000)}
`
    : '';

  const prompt = `뉴스 분석 전문가로서 다음을 분석하세요.

[입력]
${userInput}
${originalSection}

[같은 입장 검색 결과]
${supportingResults.map((r, i) => `${i + 1}. ${r.title}\n${r.url}\n${r.content.slice(0, 400)}`).join('\n\n')}

[반대 입장 검색 결과]
${opposingResults.map((r, i) => `${i + 1}. ${r.title}\n${r.url}\n${r.content.slice(0, 400)}`).join('\n\n')}

JSON 응답:
{
  "topic": "핵심 주제 (5단어 이내)",
  "originalAnalysis": {
    "title": "원문 제목",
    "topic": "핵심 이슈",
    "stance": "${originalStance || 'neutral'}",
    "summary": "핵심 주장 (2문장)",
    "keyPoints": ["논점1", "논점2", "논점3"]
  },
  "proArticles": [{"title":"","url":"","source":"","summary":"","stance":"pro","keyPoint":""}],
  "conArticles": [{"title":"","url":"","source":"","summary":"","stance":"con","keyPoint":""}],
  "balancedSummary": "균형 요약 (2문장)"
}

지침:
- proArticles: 긍정/찬성/옹호 기사
- conArticles: 부정/반대/비판 기사
- 각 최대 4개, 관련 없는 기사 제외
- JSON만 출력`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON from response');
  }

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}
