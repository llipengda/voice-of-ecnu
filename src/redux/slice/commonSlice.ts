import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    $gv485DBy$fg: false,
    shoudNotVibrate: 0
  },
  reducers: {
    $GHDFbs65f4se1(state, action: PayloadAction<boolean>) {
      state.$gv485DBy$fg = action.payload
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
  $GHDFbs65f4se1,
  increaseShoudNotVibrate,
  decreaseShoudNotVibrate
} = commonSlice.actions
