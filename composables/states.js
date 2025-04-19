export const loadedPinnedNews = () =>
  useState(() => ({ news: [], lang: "", time: 0 }));

export const loadedLatestNews = () =>
  useState(() => ({ news: [], lang: "", time: 0 }));
