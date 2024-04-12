import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '../../firebaseConfig'; // Firebase ayarlarını içeren dosya
import * as ImagePicker from 'expo-image-picker';
const windowWidth = Dimensions.get('window').width;
const WebtoonReadPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { webtoon, episode } = route.params;

  // Örnek yorumlar
  const comments = [
    { username: 'Kullanıcı1', text: 'Harika bir webtoon!' },
    { username: 'Kullanıcı2', text: 'Çok keyifli okudum.' },
    { username: 'Kullanıcı3', text: 'Biraz daha uzun olabilirdi.' },
  ];

  const [resimler, setResimler] = useState([]);

  useEffect(() => {
    const getBolumResimler = async () => {
      try {
        const resimURLs = [];
        const resimListesi = await listAll(ref(storage, `Webtoons/${webtoon}/Bölümler/${episode}`));
        for (const item of resimListesi.items) {
          const resimURL = await getDownloadURL(item);
          resimURLs.push(resimURL);
        }
        setResimler(resimURLs);
      } catch (error) {
        console.error("Bölüm resimleri alınamadı:", error);
      }
    };
    getBolumResimler();
  }, [webtoon, episode]);

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
            {/* Webtoon bilgisini kullanarak başlık oluştur */}
            <Text style={styles.title}>{webtoon}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Bildirimler')}>
          <Image source={require('../../assets/İmage/HomePage_images/bildirim.png')} style={styles.bildirimicon} />
        </TouchableOpacity>
      </View>

      {/* Orta Bölüm */}
      <ScrollView contentContainerStyle={{ flexGrow: 10 }}>
      {resimler.map((resim, index) => (
        <View key={index} style={{ alignItems: 'center', justifyContent: 'center'}}>
          <Image source={{ uri: resim }} style={{ width:windowWidth * 1, height: undefined, aspectRatio: 800 / 1800,resizeMode: 'contain'}} />
          {/* veya aspectRatio: 800 / 1900 */}
        </View>
      ))}
    </ScrollView>

      {/* alt navigasyon bölümü*/}
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
  logo: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  settingicon: {
    width: 35,
    height: 35,
  },
  bildirimicon: {
    width: 35,
    height: 35,
  },
  
  resimContainer: {
    alignItems: 'center',
  },
  resim: {
    width: 800,
    height: null,
    
  },
  
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 10,
  },
  navIcon: {
    width: 35,
    height: 35,
  },
});

export default WebtoonReadPage;
