import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Post } from 'types/post'

const initialState: { posts: Post[] } = {
  posts: [],
}

const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      return {
        ...state,
        posts: action.payload,
      }
    },
    addPost(state, action: PayloadAction<Post>) {
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      }
    },
    removePost(state, action: PayloadAction<number>) {
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
      }
    },
  },
})

export default postSlice.reducer
export const { setPosts, addPost, removePost } = postSlice.actions
