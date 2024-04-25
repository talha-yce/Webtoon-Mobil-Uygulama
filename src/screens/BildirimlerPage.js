import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { lightTheme, darkTheme,DarkToonTheme} from '../components/ThemaStil';
import { useDispatch, useSelector } from 'react-redux';
const Bildirim = ({ tarih, icerik }) => {
  return (
    <View style={styles.notificationContainer}>
      <Text style={styles.notificationDate}>{tarih}</Text>
      <Text style={styles.notificationContent}>{icerik}</Text>
    </View>
  );
}

const BildirimlerPage = () => {
  const navigation = useNavigation();
  const theme = useSelector(state => state.user.theme);
  // Bildirimler listesi burada olacak
  return (
    <View style={[styles.container, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.purpleStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.darkStil.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        
         <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../../assets/İmage/HomePage_images/settings.png')} style={styles.settingicon} />
        </TouchableOpacity>

        <View style={styles.logoyazi}>
          <Image source={require('../../assets/İmage/HomePage_images/icon1.png')} style={styles.logo} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>DARK</Text>
            <Text style={styles.subtitle}>TON</Text>
          </View>
        </View>
       
        <TouchableOpacity onPress={() => navigation.navigate('Bildirimler')}>
          <Image source={require('../../assets/İmage/HomePage_images/bildirim.png')} style={styles.bildirimicon} />
        </TouchableOpacity>
      </View>

      {/* Bildirimler */}
      <ScrollView style={styles.scrollView}>
       <View style={styles.notificationSection}>
          <Text style={styles.sectionTitle}>Bugün</Text>
          <Bildirim tarih="Bugün" icerik="Yeni bölüm yayında! - Webtoon adı" />
        </View>
        <View style={styles.notificationSection}>
          <Text style={styles.sectionTitle}>Dün</Text>
          <Bildirim tarih="Dün" icerik="Güncelleme: Yeni özellikler eklendi!" />
        </View>
       
      </ScrollView>
      {/* alt navigaysyon bölümu*/}
      <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/İmage/HomePage_images/home.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Kesfet')}>
          <Image source={require('../../assets/İmage/HomePage_images/keşif.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Kaydet')}>
          <Image source={require('../../assets/İmage/HomePage_images/save.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
          <Image source={require('../../assets/İmage/HomePage_images/profil.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#ffb685',
  },
  subtitle: {
    fontSize: 20,
    color: '#ffb685',
    position: 'relative',
    left: 37,
    top: -5,
  },
  logoyazi: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: 'white',
  },
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 10,
  },
  navText: {
    fontSize: 16,
    color: 'white',
  },
  settingicon: {
    width: 35,
    height: 35,
  },
  logo: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  bildirimicon: {
    width: 35,
    height: 35,
  },
  navIcon: {
    width: 35,
    height: 35,
  },
  notificationSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  notificationContainer: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  notificationDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationContent: {
    fontSize: 16,
  },
});

export default BildirimlerPage;
