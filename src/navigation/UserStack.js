import React from "react";
import { HomePage,SettingsPage,BildirimlerPage,ProfilPage,KaydetPage,KesifPage } from "../screens";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack=createNativeStackNavigator();

const UserStack=()=>{
    return(
        <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{headerShown:false}}>

            <Stack.Screen name="Home" component={HomePage}/>
            <Stack.Screen name="Settings" component={SettingsPage}/>
            <Stack.Screen name="Bildirimler" component={BildirimlerPage}/>
            <Stack.Screen name="Profil" component={ProfilPage}/>
            <Stack.Screen name="Kaydet" component={KaydetPage}/>
            <Stack.Screen name="Kesfet" component={KesifPage}/>

        </Stack.Navigator>
    );
}
export default UserStack;
