import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    yuntianMode: false,
    shoudNotVibrate: 0
  },
  reducers: {
    setYuntianMode(state, action: PayloadAction<boolean>) {
      state.yuntianMode = action.payload
    },
    increaseShoudNotVibrate(state) {
      state.shoudNotVibrate += 1
    },
    decreaseShoudNotVibrate(state) {
      state.shoudNotVibrate -= 1
    }
  }
})

export default commonSlice.reducer
export const {
  setYuntianMode,
  increaseShoudNotVibrate,
  decreaseShoudNotVibrate
} = commonSlice.actions
