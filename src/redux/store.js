import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import useReducer  from './userSlice'

export const store = configureStore({
  reducer: {
    user:useReducer
  },
  middleware:(getDefaulMiddlware)=>getDefaulMiddlware({serializableCheck:false})
})