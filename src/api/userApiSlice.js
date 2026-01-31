import { baseApiSlice } from "../api/baseApiSlice";

export const userApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => "/user/me",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserProfileQuery } = userApiSlice;
