import { checkReview } from '@/utils/checkReview'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    showComponent: checkReview(),
  },
  reducers: {
    setReview(state, action: PayloadAction<boolean>) {
      state.showComponent = action.payload
    },
  },
})

export const { setReview } = reviewSlice.actions
export default reviewSlice.reducer
