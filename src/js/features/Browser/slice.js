import { createSlice } from "@reduxjs/toolkit";
import { metaByServer, compareServers } from "../../common/util";

const getInitialState = () => ({
  ui: {
    favorites: {
      servers: [],
    },
    filters: {
      keyword: "",
    },
  },
  entries: [],
});

export default createSlice({
  name: "form",
  initialState: getInitialState(),
  reducers: {
    updateEntries: (state, action) => {
      const { entries } = action.payload;

      for (let i = 0; i < entries.length; i++) {
        entries[i].meta = metaByServer(entries[i]);
      }

      entries.sort(compareServers);

      state.entries = entries;
    },
    updateFilters: (state, action) => {
      const { values } = action.payload;
      state.ui.filters = values;
    },
    toggleFavoriteServer: (state, action) => {
      const { serverAddress } = action.payload;

      const index = state.ui.favorites.servers.indexOf(serverAddress);
      const isFavorite = index !== -1;

      if (isFavorite) {
        state.ui.favorites.servers.splice(index, 1);
      } else {
        state.ui.favorites.servers.push(serverAddress);
      }
    },
  },
});
