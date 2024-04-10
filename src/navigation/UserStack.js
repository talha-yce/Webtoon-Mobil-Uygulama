import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomePage, SettingsPage, BildirimlerPage, ProfilPage, KaydetPage, KesifPage } from "../screens";

const Tab = createBottomTabNavigator();

const UserStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false, // Etiketleri gizlemek için
        tabBarStyle: {
          display: 'none' // Alt navigasyon çubuğunu gizlemek için
        },
        headerShown: false // Üst kısımdaki başlık çubuğunu gizlemek için
      }}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Settings" component={SettingsPage} />
      <Tab.Screen name="Bildirimler" component={BildirimlerPage} />
      <Tab.Screen name="Profil" component={ProfilPage} />
      <Tab.Screen name="Kaydet" component={KaydetPage} />
      <Tab.Screen name="Kesfet" component={KesifPage} />
    </Tab.Navigator>
  );
}

export default UserStack;
