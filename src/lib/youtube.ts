import { YoutubeTranscript } from 'youtube-transcript';

export interface YouTubeContent {
  videoId: string;
  title: string;
  transcript: string;
  source: 'YouTube';
}

export function isYouTubeUrl(url: string): boolean {
  return (
    url.includes('youtube.com/watch') ||
    url.includes('youtu.be/') ||
    url.includes('youtube.com/shorts/')
  );
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export async function getYouTubeTranscript(url: string): Promise<YouTubeContent | null> {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: 'ko',
    });

    if (!transcriptItems || transcriptItems.length === 0) {
      const transcriptItemsAuto = await YoutubeTranscript.fetchTranscript(videoId);
      if (!transcriptItemsAuto || transcriptItemsAuto.length === 0) {
        return null;
      }
      
      const transcript = transcriptItemsAuto
        .map((item) => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        videoId,
        title: `YouTube 영상 (${videoId})`,
        transcript,
        source: 'YouTube',
      };
    }

    const transcript = transcriptItems
      .map((item) => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      videoId,
      title: `YouTube 영상 (${videoId})`,
      transcript,
      source: 'YouTube',
    };
  } catch (error) {
    console.error('YouTube transcript error:', error);
    return null;
  }
}

export async function getYouTubeTitle(videoId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (response.ok) {
      const data = await response.json();
      return data.title || `YouTube 영상 (${videoId})`;
    }
  } catch {
  }
  return `YouTube 영상 (${videoId})`;
}
