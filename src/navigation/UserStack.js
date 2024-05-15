import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage, SettingsPage, ProfilPage, KaydetPage, KesifPage,WebtoonInfoPage,WebtoonReadPage } from "../screens";

const Tab = createBottomTabNavigator();

const UserStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false, 
        tabBarStyle: {
          display: 'none' 
        },
        headerShown: false 
      }}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Settings" component={SettingsPage} />
      <Tab.Screen name="Profil" component={ProfilPage} />
      <Tab.Screen name="Kaydet" component={KaydetPage} />
      <Tab.Screen name="Kesfet" component={KesifPage} />
      <Tab.Screen name="WebtoonInfoPage" component={WebtoonInfoPage} />
      <Tab.Screen name="WebtoonReadPage" component={WebtoonReadPage} />
    </Tab.Navigator>
  );
}

export default UserStack;
