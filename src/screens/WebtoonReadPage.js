import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '../../firebaseConfig'; // Firebase ayarlarını içeren dosya
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme,DarkToonTheme} from '../components/ThemaStil';
const windowWidth = Dimensions.get('window').width;

const WebtoonReadPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { webtoon, episode } = route.params;
  const theme = useSelector(state => state.user.theme);
  // Örnek yorumlar
  const comments = [
    { username: 'Kullanıcı1', text: 'Harika bir webtoon!' },
    { username: 'Kullanıcı2', text: 'Çok keyifli okudum.' },
    { username: 'Kullanıcı3', text: 'Biraz daha uzun olabilirdi.' },
  ];

  const [resimler, setResimler] = useState([]);
  const [resimYukseklik, setResimYukseklik] = useState(0);

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

  useEffect(() => {
    if (resimler.length > 0) {
      Image.getSize(resimler[0], (width, height) => {
        const oran = height / width;
        setResimYukseklik(windowWidth * oran);
      });
    }
  }, [resimler]);

  const [resimIndex, setResimIndex] = useState(0);

  const handleIleri = () => {
    if (resimIndex < resimler.length - 1) {
      setResimIndex(resimIndex + 1);
      scrollToTop(); 
    }
  };

  const handleGeri = () => {
    if (resimIndex > 0) {
      setResimIndex(resimIndex - 1);
      scrollToTop(); 
    }
  };

  const scrollViewRef = useRef();
  
  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };

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

      {/* Orta Bölüm */}
      <View style={styles.middleContainer}>
        {/* Üst Buton Konteynırı */}
        <View style={styles.topButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleGeri}>
            <Text style={styles.buttonText}>Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{webtoon}</Text>
          <TouchableOpacity style={styles.button} onPress={handleIleri}>
            <Text style={styles.buttonText}>İleri</Text>
          </TouchableOpacity>
        </View>

        {/* Alt Bölge Konteynırı */}
        <ScrollView
          ref={scrollViewRef} 
          style={styles.bottomContainer}
          onContentSizeChange={scrollToTop} 
        >
          {/* Resimler Konteynırı */}
          <View style={styles.imageContainer}>
  {resimler.length > 0 && (
    <Image
      source={{ uri: resimler[resimIndex] }}
      style={[styles.image, { height: resimYukseklik }]}
      resizeMode="contain" 
    />
  )}
</View>


          {/* Yorumlar */}
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Yorumlar</Text>
            {/* Yorumları listeleme */}
            {comments.map((comment, index) => (
              <View key={index} style={styles.comment}>
                <Image source={require('../../assets/İmage/HomePage_images/profil.png')} style={styles.commentAvatar} />
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentUsername}>{comment.username}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

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
  middleContainer: {
    flex: 1,
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  bottomContainer: {
    flex: 1,
    marginTop: 10,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: windowWidth, // Ekran genişliği kadar genişlik
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
  commentsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  commentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  commentText: {
    fontSize: 14,
    color: 'black',
  },
});

export default WebtoonReadPage;
