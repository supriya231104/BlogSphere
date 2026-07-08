import { createSlice } from "@reduxjs/toolkit";

const EditBlogSlice = createSlice({
  name: "EditBlogSlice",
  initialState: {
    blogData: null,
  },
  reducers: {
    setBlogData: (state, action) => {
      state.blogData = action.payload;
    },
    clearBlogData: (state, action) => {
      state.blogData = null;
    },
  },
});
export const { setBlogData, clearBlogData } = EditBlogSlice.actions;
export default EditBlogSlice.reducer;
