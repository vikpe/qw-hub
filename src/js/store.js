import { configureStore } from "@reduxjs/toolkit";
//import { setupListeners } from '@reduxjs/toolkit/query'
import { qwsSlice } from "./services/qws/qws.js";
import filtersSlice from "./Servers/filtersSlice.js";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [filtersSlice.name]: filtersSlice.reducer,
    [qwsSlice.reducerPath]: qwsSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(qwsSlice.middleware),
});
export default store;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
//setupListeners(store.dispatch)
