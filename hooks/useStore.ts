import { createJSONStorage, persist } from "zustand/middleware";
import { API_KEY, API_URL } from "@/constants/secrets";
import axios from "axios";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NewsArticle {
  source: { id: string | null; name: string };
  author: string;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsState {
  newsListing: NewsArticle[];
  setNewsListing: (news: NewsArticle[]) => void;
  pinnedArticles: string[];
  mergeNewsListing: (news: NewsArticle[]) => void;
  addRandomHeadlines: () => void;
  refreshHeadlines: () => void;
  pinArticle: (id: string) => void;
  unpinArticle: (id: string) => void;
  dripTimer: NodeJS.Timer | null;
}

export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const useStore = create<NewsState>()(
  persist(
    (set, get) => ({
      newsListing: [],
      pinnedArticles: [],
      setNewsListing: (news) => set({ newsListing: news }),
      mergeNewsListing: (news: NewsArticle[]) => {
        set((state) => {
          const pinned = state.pinnedArticles
            .map((id) => state.newsListing.find((article) => article.id === id))
            .filter(Boolean) as NewsArticle[];

          const nonPinned = news.filter(
            (article) => !state.pinnedArticles.includes(article.id)
          );

          return {
            newsListing: [...pinned, ...nonPinned],
          };
        });
      },
      addRandomHeadlines: async () => {
        try {
          const response = await axios.get(
            `${API_URL}everything?q=everything&apiKey=${API_KEY}`
          );
          const articles = response.data.articles
            .slice(0, 5)
            .map((article: any) => ({
              ...article,
              id: generateUUID(),
            }));

          console.log("--->", JSON.stringify(articles, null, 2));

          set((state) => {
            const pinned = state.pinnedArticles
              .map((id) =>
                state.newsListing.find((article) => article.id === id)
              )
              .filter(Boolean) as NewsArticle[];
            const nonPinned = articles.filter(
              (newArticle: any) =>
                !state.newsListing.some(
                  (existingArticle) => existingArticle.id === newArticle.id
                )
            );

            return {
              newsListing: [
                ...pinned,
                ...nonPinned,
                ...state.newsListing.filter(
                  (article) => !pinned.includes(article)
                ),
              ],
            };
          });
        } catch (error) {
          console.log("---->", JSON.stringify(error, null, 2));
        }
      },
      refreshHeadlines: async () => {
        try {
          const response = await axios.get(
            `${API_URL}top-headlines?country=in&apiKey=${API_KEY}`
          );
          const articles = response.data.articles
            .slice(0, 5)
            .map((article: any) => ({
              ...article,
              id: generateUUID(),
            }));
          set((state) => {
            newsListing: articles;
          });
          // set((state) => {
          //   const pinned = state.pinnedArticles
          //     .map((id) =>
          //       state.newsListing.find((article) => article.id === id)
          //     )
          //     .filter(Boolean) as NewsArticle[];

          //   return {
          //     newsListing: [...pinned, ...articles],
          //   };
          // });

          // const newTimer = setInterval(() => {
          //   get().addRandomHeadlines();
          // }, 10000);
          // set({ dripTimer: newTimer });
        } catch (error) {
          console.log(JSON.stringify(error, null, 2));
        }
      },

      pinArticle: (id) => {
        console.log(`Pinning article ID: ${id}`);
        set((state) => {
          const pinned = [...new Set([id, ...state.pinnedArticles])];
          const updatedListing = state.newsListing.filter(
            (article) => article.id !== id
          );
          const pinnedArticle = state.newsListing.find(
            (article) => article.id === id
          );
          return {
            pinnedArticles: pinned,
            newsListing: [pinnedArticle, ...updatedListing],
          };
        });
      },
      unpinArticle: (id) => {
        console.log(`Unpinning article ID: ${id}`);
        set((state) => {
          const updatedPinnedArticles = state.pinnedArticles.filter(
            (articleId) => articleId !== id
          );
          const updatedListing = state.newsListing.filter(
            (article) => article.id !== id
          );
          const unpinnedArticle = state.newsListing.find(
            (article) => article.id === id
          );
          return {
            pinnedArticles: updatedPinnedArticles,
            newsListing: [...updatedListing, unpinnedArticle].filter(Boolean),
          };
        });
      },
      dripTimer: null,
    }),
    {
      name: "news-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
