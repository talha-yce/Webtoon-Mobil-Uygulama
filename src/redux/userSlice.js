import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage düzeltildi
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig';
//kullanıcı giriş işlemleri


export const changeTheme = (theme) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem('theme', theme); 
      dispatch(setTheme(theme)); 
    } catch (error) {
      console.error("Tema değiştirme hatası:", error);
    }
  };
};



export const login = createAsyncThunk('user/login', async ({ email, password }) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = user.stsTokenManager.accessToken;
  
      
      const userData = {
        token,
        user: user,
      }

      await AsyncStorage.setItem("userToken",token)

  
      return userData;
    } catch (error) {
      console.log("userSlice 21 line: ", error);
      throw error;
    }
  });


  //kullanıcı otomatik giriş işlemleri
export const autoLogin=createAsyncThunk("user/autoLogin",async()=>{
  try {
    const token=await AsyncStorage.getItem("userToken")
    if (token) {
      return token
    } else {
      throw new Error("User Not Found")
    }

  } catch (error) {
    throw error
  }
});

//kullanıcı çıkış işlemleri
export const logout=createAsyncThunk("user/logout",async()=>{
try {
  const auth=getAuth()
  await signOut(auth)
  await AsyncStorage.removeItem("userToken")
  return null;
} catch (error) {
  throw error
}

})

//kullanıcı kaydı
export const register = createAsyncThunk("user/register", async ({ name, email, password }) => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = user.stsTokenManager.accessToken;

    // Firestore'da yeni bir belge eklemek için addDoc fonksiyonunu kullan
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: name,
      email: email,
      kaydet: 0,
      like: 0,
      okunan: 0
    });

    await sendEmailVerification(user);
    await AsyncStorage.setItem("userToken", token); // AsyncStorge yerine AsyncStorage kullanılmalı

    return token;
  } catch (error) {
    console.log("Register Error:", error); // Hata mesajını konsola yazdır
    throw error;
  }
});



const initialState = {
  isLoading: false,
  isAuth: false,
  token: null,
  user:null,
  error: null,
  theme: 'DarkToon', 
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
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
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
      })


      .addCase(autoLogin.pending, (state) => {
        state.isLoading = true;
        state.isAuth = false;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.token = action.payload;
      })
      .addCase(autoLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.token=null;
      })


      .addCase(logout.pending, (state) => {
        state.isLoading = true;
       
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.token = null;
        state.error=null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error=action.payload
      })


      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isAuth = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        console.log("Durum:",state.isAuth);
        state.token = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.error="Geçersiz Email veya Şifre"
      })


      
  }
});

export const { setEmail, setPassword, setIsLoading, setTheme } = userSlice.actions;
export default userSlice.reducer;
