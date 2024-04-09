import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const login = createAsyncThunk('user/login', async ({ email, password }) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = user.stsTokenManager.accessToken;
  
      // Sadece e-posta adresini içeren bir nesne döndürün
      const userData = {
        token,
        email: user.email,
      }
  
      return userData;
    } catch (error) {
      console.log("userSlice 21 line: ", error);
      throw error;
    }
  });

const initialState = {
  isLoading: false,
  isAuth: false,
  token: null,
  user:null,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setExit: (state) => {
      state.isAuth = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isAuth = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.error = action.error.message;
      });
  }
});

export const { setEmail, setPassword, setIsLoading, setExit } = userSlice.actions;
export default userSlice.reducer;
