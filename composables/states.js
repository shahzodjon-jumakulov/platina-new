export const loadedPinnedNews = () =>
  useState(() => ({ news: [], lang: "", time: 0 }));

export const loadedLatestNews = () =>
  useState(() => ({ news: [], lang: "", time: 0 }));

export const loadedPopularNews = () =>
  useState(() => ({ news: [], lang: "", time: 0 }));

export const useSelectedNews = () => useState(() => null);

export const storeSelected = (news) => {
  const selectedNews = useSelectedNews();
  selectedNews.value = news;
};

export const useShorts = () => useState(() => ({ open: false, url: "", }));
