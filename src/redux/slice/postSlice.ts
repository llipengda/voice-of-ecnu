import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Post as OPost } from '@/types/post'
import { WithUserInfo } from '@/types/withUserInfo'

type Post = WithUserInfo<OPost>

const initialState: {
  posts: Post[]
  selectedIndex: number
} = {
  posts: [],
  selectedIndex: 0
}

const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      return {
        ...state,
        posts: action.payload
      }
    },
    addPost(state, action: PayloadAction<Post>) {
      if (state.selectedIndex === 1) {
        return state
      }
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      }
    },
    removePost(state, action: PayloadAction<number>) {
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      }
    },
    changeSelectedIndex(state, action: PayloadAction<number>) {
      return {
        ...state,
        selectedIndex: action.payload
      }
    }
  }
})

export default postSlice.reducer
export const { setPosts, addPost, removePost, changeSelectedIndex } =
  postSlice.actions
