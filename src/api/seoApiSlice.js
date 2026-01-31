import { baseApiSlice } from "./baseApiSlice";

export const seoApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSeoByPage: builder.query({
      query: (page_identifier) => ({
        url: `/api/v1/seo`,
        method: "GET",
        params: { page_identifier }, // This adds ?page_identifier=value
      }),
      providesTags: ["Seo"],
    }),
  }),
});

export const { useGetSeoByPageQuery } = seoApiSlice;
