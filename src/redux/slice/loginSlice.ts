import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import Taro from '@tarojs/taro'
import { LoginInfo } from 'types/user'

const initialState: LoginInfo = {
  userId: Taro.getStorageSync('userId') || '',
  token: Taro.getStorageSync('token') || '',
  role: 4,
}

const loginSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {
    setLoginInfo(_state, action: PayloadAction<LoginInfo>) {
      return action.payload
    },
    clearLoginInfo() {
      return initialState
    },
    setRole(state, action: PayloadAction<0 | 1 | 2 | 3>) {
      return {
        ...state,
        role: action.payload,
      }
    },
    setToken(state, action: PayloadAction<string>) {
      return {
        ...state,
        token: action.payload,
      }
    },
    setUserId(state, action: PayloadAction<string>) {
      return {
        ...state,
        token: action.payload,
      }
    },
  },
})

export default loginSlice.reducer
export const { setLoginInfo, clearLoginInfo, setRole, setToken, setUserId } =
  loginSlice.actions
