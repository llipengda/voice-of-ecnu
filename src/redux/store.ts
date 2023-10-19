import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/userSlice'
import loginSlice from './slice/loginSlice'

const store = configureStore({
  reducer: {
    user: userSlice,
    login: loginSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
