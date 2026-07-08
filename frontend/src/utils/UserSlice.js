import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",

  // ✅ Flat state (NO nesting)
  initialState: {
    email: null,
    id: null,
    token: null,
    photoURL:"",
    name:"",
    followingsList:[],
    userName:""
    // pho displayName photoURL email
  },

  reducers: {
    // ✅ Set user
    setUser: (state, action) => {
      const { email, token, id,photoURL,name,userName } = action.payload;
     

      state.email = email;
      state.userName=userName
      state.token = token;
      state.id = id;
      state.photoURL=photoURL
      state.name=name
    },
    setFollowingsList:(state,action)=>{
     
      state.followingsList=action.payload
    },
    

    // ✅ Logout / clear
    clearUser: (state) => {
      state.email = null;
      state.token = null;
      state.id = null;
      state.photoURL="",
      state.name="",
      state.userName="",
      state.followingsList=[]
    },
  },
});

export const { setUser, clearUser,setFollowingsList } = UserSlice.actions;
export default UserSlice.reducer;