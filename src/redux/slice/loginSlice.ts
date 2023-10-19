import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { LoginInfo } from 'types/user'

const initialState: LoginInfo = {
  userId: '',
  token: '',
  role: 3,
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
  },
})

export default loginSlice.reducer
export const { setLoginInfo, clearLoginInfo } = loginSlice.actions
