/** Thumbnail served by YouTube itself; `hqdefault` exists for every public video. */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/** Privacy-enhanced embed: YouTube sets no cookies until the visitor presses play. */
export function youtubeEmbedUrl(videoId: string, autoplay = true): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0${autoplay ? '&autoplay=1' : ''}`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
