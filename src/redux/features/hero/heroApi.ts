import { baseApi } from "../../api/baseApi";


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

export const heroApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addHero: builder.mutation<HeroArticle, Partial<HeroArticle>>({
      query: (heroData) => ({
        url: "/hero/create-hero",
        method: "POST",
        body: heroData,
      }),
      invalidatesTags: ["Hero"],
    }),

    getHeroes: builder.query<HeroArticle[], void>({
      query: () => "/hero",
      providesTags: ["Hero"],
      transformResponse: (response: HeroArticle[]) => {
        return response.map((article) => ({
          ...article,
          createdAt: new Date().toISOString(), // Add timestamp if needed
        }));
      },
    }),

    updateHero: builder.mutation<
      HeroArticle,
      { id: string; updates: Partial<HeroArticle> }
    >({
      query: ({ id, updates }) => ({
        url: `/hero/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Hero"],
    }),

    deleteHero: builder.mutation<void, string>({
      query: (id) => ({
        url: `/hero/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hero"],
    }),
  }),
});

export const {
  useAddHeroMutation,
  useGetHeroesQuery,
  useUpdateHeroMutation,
  useDeleteHeroMutation,
} = heroApi;
