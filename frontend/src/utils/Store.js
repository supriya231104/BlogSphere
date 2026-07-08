import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import EditBlogSlice from "./EditBlogSlice"
import CommentSlice from './CommentSlice'
const storageEngine = storage.default || storage;

const persistConfig = {
  key: "user",
  storage: storageEngine,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    UserSlice: persistedReducer,
    EditBlogSlice:EditBlogSlice,
    CommentSlice:CommentSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Specifically ignore these redux-persist action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Named export is much safer in Vite
export const persistor = persistStore(store);
