import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from "./AuthStack";
import UserStack from './UserStack'

const RootNavigation = () => {

    const isAuth = true;

    return (
        <NavigationContainer>
            {isAuth ? <UserStack /> : <AuthStack />} 
        </NavigationContainer>
    );
}

export default RootNavigation;
