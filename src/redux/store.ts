import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/userSlice'
import loginSlice from './slice/loginSlice'
import postSlice from './slice/postSlice'
import noticeSlice from './slice/noticeSlice'
import reviewSlice from './slice/reviewSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    login: loginSlice,
    post: postSlice,
    notice: noticeSlice,
    review: reviewSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
