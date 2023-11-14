import { checkReview } from '@/utils/checkReview'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    showComponent: checkReview()
  },
  reducers: {
    setShowComponent(state, action: PayloadAction<boolean>) {
      state.showComponent = action.payload
    }
  }
})

export const { setShowComponent } = reviewSlice.actions
export default reviewSlice.reducer
