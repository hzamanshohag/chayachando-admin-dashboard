import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface HeroArticle {
  image: string;
  title: string;
  sortDes: string;
  colSpan: string;
  articleID: string;
  category:
    | "সংবাদ"
    | "মতামত"
    | "বিনোদন"
    | "খেলাধুলা"
    | "সাক্ষাৎকার"
    | "ব্যক্তিত্ব"
    | "বিবিধ";
}

interface HeroState {
  heroes: HeroArticle[];
  loading: boolean;
  error: string | null;
}

const initialState: HeroState = {
  heroes: [],
  loading: false,
  error: null,
};

const heroSlice = createSlice({
  name: "hero",
  initialState,
  reducers: {
    setHeroes: (state, action: PayloadAction<HeroArticle[]>) => {
      state.heroes = action.payload;
    },
    addHeroLocal: (state, action: PayloadAction<HeroArticle>) => {
      state.heroes.unshift(action.payload);
    },
    updateHeroLocal: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<HeroArticle> }>
    ) => {
      const { id, updates } = action.payload;
      const index = state.heroes.findIndex((hero) => hero.articleID === id);
      if (index !== -1) {
        state.heroes[index] = { ...state.heroes[index], ...updates };
      }
    },
    deleteHeroLocal: (state, action: PayloadAction<string>) => {
      state.heroes = state.heroes.filter(
        (hero) => hero.articleID !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setHeroes,
  addHeroLocal,
  updateHeroLocal,
  deleteHeroLocal,
  setLoading,
  setError,
} = heroSlice.actions;

export default heroSlice.reducer;
