import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/userSlice'
import loginSlice from './slice/loginSlice'
import postSlice from './slice/postSlice'
import noticeSlice from './slice/noticeSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    login: loginSlice,
    post: postSlice,
    notice: noticeSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
