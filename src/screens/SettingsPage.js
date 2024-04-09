import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setExit } from '../redux/userSlice';
const SettingsPage = () => {
  const [contentLanguage, setContentLanguage] = useState('Türkçe');
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const renderItem = (title, content) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );

  return (
    <View style={styles.container}>
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
      {/* Content */}
      <ScrollView style={styles.scrollView}>
      {/* ayarMenu */}
      <View style={styles.ayarMenu}>
        {renderItem("HESAP:", <Text>Petro 8290</Text>)}
        
        {renderItem("TAKMA AD:", <Text>Petro #8290</Text>)}
        {renderItem("SEÇENEKLER:", null)}
        {renderItem("Uygulama Dili:", 
          <TouchableOpacity style={styles.optionButton} onPress={() => setContentLanguage('Türkçe')}>
            <Text style={styles.optionButtonText}>{contentLanguage}</Text>
          </TouchableOpacity>
        )}
        {renderItem("Önbelleği Temizle:", <TouchableOpacity><Text>30-41 MB</Text></TouchableOpacity>)}
        {renderItem("Tema:", <TouchableOpacity><Text>Tema</Text></TouchableOpacity>)}
        {renderItem("BİLDİRİMLER:", null)}
        {renderItem("Servis Bildirimi", <Switch/>)}
        {renderItem("Güncel Yeni Bölüm", <Switch/>)} 
        {renderItem("Göz rahatlığı:", <Switch/>)}
        {renderItem("HAKKINDA:", null)}
        {renderItem("Fark Etme:", <TouchableOpacity><Text>Fark Etme</Text></TouchableOpacity>)}
        {renderItem("Yardım:", <TouchableOpacity><Text>Yardım</Text></TouchableOpacity>)}
        {renderItem("Kullanım Şekilleri:", <TouchableOpacity><Text>Kullanım Şekilleri</Text></TouchableOpacity>)}
        
        {/* Çıkış Yap butonu */}
        <View style={styles.exitButtonContainer}>
          <TouchableOpacity style={styles.exitButton} onPress={() => dispatch(setExit())}>
            <Text style={styles.exitButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      {/* alt navigaysyon bölümu*/}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/İmage/HomePage_images/home.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Keşfet tıklandı")}>
          <Image source={require('../../assets/İmage/HomePage_images/keşif.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Kaydedilenler tıklandı")}>
          <Image source={require('../../assets/İmage/HomePage_images/save.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Profil tıklandı")}>
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
    color: 'white',
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    position: 'relative',
    left: 37,
    top: -5,
  },
  logoyazi: {
    flexDirection: 'row',
    alignItems: 'center',
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
  ayarMenu: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionButton: {
    paddingVertical: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionButtonText: {
    color: 'black',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: 'white',
  },
  bildirimicon: {
    width: 35,
    height: 35,
  },
  navIcon: {
    width: 35,
    height: 35,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 10,
  },
  exitButtonContainer: {
    alignItems: 'flex-end', 
    margin: 10,
    marginRight: 20,
    justifyContent: 'center',
  },
  exitButton: {
    backgroundColor: 'purple', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  exitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsPage;
