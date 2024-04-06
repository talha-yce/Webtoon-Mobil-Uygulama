import React from "react";
import { HomePage,SettingsPage } from "../screens";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack=createNativeStackNavigator();

const UserStack=()=>{
    return(
        <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{headerShown:false}}>

            <Stack.Screen name="Home" component={HomePage}/>
            <Stack.Screen name="Settings" component={SettingsPage}/>

        </Stack.Navigator>
    );
}
export default UserStack;
