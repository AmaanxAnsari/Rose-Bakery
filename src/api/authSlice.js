// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   token: null,
//   roles: [], // dynamic roles here
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       const { user, token, roles } = action.payload;
//       state.user = user;
//       state.token = token;
//       state.roles = roles || [];
//       state.isAuthenticated = true;
//     },
    
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.roles = [];
//       state.isAuthenticated = false;
//       localStorage.removeItem("auth");
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  roles: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.roles = action.payload.roles || [];
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.roles = [];
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

