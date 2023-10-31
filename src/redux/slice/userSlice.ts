import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { User } from 'types/user'

const initialState: User = {
  id: '',
  role: 4,
  name: '未登录',
  avatar: '',
  createTime: '',
  gender: 0,
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser(_state, action: PayloadAction<User>) {
      return action.payload
    },
    clearUser() {
      return initialState
    },
  },
})

export default userSlice.reducer
export const { setUser, clearUser } = userSlice.actions
