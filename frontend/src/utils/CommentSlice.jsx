import { createSlice } from "@reduxjs/toolkit";

const CommentSlice=createSlice({
    name:'CommentSlice',
    initialState:{
        user:null,
        comments:[]
    },
    reducers:{
        SetComments:(state,action)=>{
                state.comments=action.payload
        },
        SetUser:(state,action)=>{
                state.user=action.payload
        }
    }

})
export const {SetComments,SetUser}=CommentSlice.actions
export default CommentSlice.reducer
