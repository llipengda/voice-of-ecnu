import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/userSlice'
import loginSlice from './slice/loginSlice'
import postSlice from './slice/postSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    login: loginSlice,
    post: postSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
