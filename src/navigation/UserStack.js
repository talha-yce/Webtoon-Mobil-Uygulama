import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage, SettingsPage, BildirimlerPage, ProfilPage, KaydetPage, KesifPage,KesfetWebtoonPage } from "../screens";

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
      <Tab.Screen name="Bildirimler" component={BildirimlerPage} />
      <Tab.Screen name="Profil" component={ProfilPage} />
      <Tab.Screen name="Kaydet" component={KaydetPage} />
      <Tab.Screen name="Kesfet" component={KesifPage} />
      <Tab.Screen name="KesfetWebtoonPage" component={KesfetWebtoonPage} />
    </Tab.Navigator>
  );
}

export default UserStack;
