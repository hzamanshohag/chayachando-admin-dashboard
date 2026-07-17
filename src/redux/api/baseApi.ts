import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://bd-news-backend.vercel.app/api",
  }),
  tagTypes: ["Hero"],
  endpoints: () => ({}),
});
