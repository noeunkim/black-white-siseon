export type StreamEvent =
    | { type: 'start'; message: string }
    | { type: 'fetch_original'; message: string; data?: { hasContent: boolean; title?: string; source?: string } }
    | { type: 'extract_topic'; message: string; data?: { topic: string; stance: string; supportingQuery: string; opposingQuery: string } }
    | { type: 'search_pro'; message: string }
    | { type: 'search_con'; message: string }
    | { type: 'search_pro_done'; message: string; data: { articles: any[] } }
    | { type: 'search_con_done'; message: string; data: { articles: any[] } }
    | { type: 'analyze'; message: string }
    | { type: 'complete'; message: string; data: { result: any } }
    | { type: 'error'; message: string };
