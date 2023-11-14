import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import userSlice from './slice/userSlice'
import loginSlice from './slice/loginSlice'
import postSlice from './slice/postSlice'
import noticeSlice from './slice/noticeSlice'
import reviewSlice from './slice/reviewSlice'
import commonSlice from './slice/commonSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    login: loginSlice,
    post: postSlice,
    notice: noticeSlice,
    review: reviewSlice,
    common: commonSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
