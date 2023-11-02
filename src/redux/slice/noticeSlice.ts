import { NoticeCnt } from '@/types/notice'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: NoticeCnt = {
  total: 0,
  system: 0,
  reply: {
    total: 0,
    comment: 0,
    post: 0,
    reply: 0,
  },
  like: {
    total: 0,
    comment: 0,
    post: 0,
    reply: 0,
  },
}

const noticeSlice = createSlice({
  name: 'notice',
  initialState: initialState,
  reducers: {
    setNoticeCnt(_, action: PayloadAction<NoticeCnt>) {
      return action.payload
    },
    clearSystemNoticeCnt(state) {
      return {
        ...state,
        total: state.total - state.system,
        system: 0,
      }
    },
    clearReplyNoticeCnt(state) {
      return {
        ...state,
        total: state.total - state.reply.total,
        reply: {
          total: 0,
          comment: 0,
          post: 0,
          reply: 0,
        },
      }
    },
    clearLikeNoticeCnt(state) {
      return {
        ...state,
        total: state.total - state.like.total,
        like: {
          total: 0,
          comment: 0,
          post: 0,
          reply: 0,
        },
      }
    },
  },
})

export default noticeSlice.reducer
export const {
  setNoticeCnt,
  clearSystemNoticeCnt,
  clearReplyNoticeCnt,
  clearLikeNoticeCnt,
} = noticeSlice.actions
