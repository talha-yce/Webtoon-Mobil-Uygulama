import {createSlice} from "@reduxjs/toolkit";

const initialState={
    email:null,
    password:null,
    isLoading:false,
    isAuth:false,
    user:{
        usermail:"123@123",
        userpassword:"123456"
    }
}

export const userSlice = createSlice({
      name:'user',  
      initialState,
      reducers:{
        setEmail:(state,actions)=>{
            //const loverCaseEmail=actions.payload.toLowerCase()
            state.email=actions.payload
        },
        setPassword:(state,actions)=>{
            state.password=actions.payload
        },
        setIsLoading:(state,actions)=>{
            state.isLoading=actions.payload
        },
        setLogin:(state)=>{
            if((state.email===state.user.usermail)
                &&(state.password===state.user.userpassword)){
                    state.isAuth=true
            }
            else{
                state.isAuth=false
            }
        }
      }
})

       
export const {setEmail,setPassword,setIsLoading,setLogin}= userSlice.actions
export default userSlice.reducer;