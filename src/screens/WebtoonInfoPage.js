import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '../../firebaseConfig'; // Firebase ayarlarını içeren dosya
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme,DarkToonTheme} from '../components/ThemaStil';
const WebtoonInfoPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { webtoon } = route.params;

  // Örnek yorumlar
  const comments = [
    { username: 'Kullanıcı1', text: 'Harika bir webtoon!' },
    { username: 'Kullanıcı2', text: 'Çok keyifli okudum.' },
    { username: 'Kullanıcı3', text: 'Biraz daha uzun olabilirdi.' },
  ];
  const theme = useSelector(state => state.user.theme);
  
  const [bolumler, setBolumler] = useState([]);
  
  const [kapakResmi, setKapakResmi] = useState(null);

  useEffect(() => {
    
    getDownloadURL(ref(storage, `Webtoons/${webtoon}/Kapak/${webtoon}.jpg`))
    .then(url => setKapakResmi(url))
    .catch(error => {
      
      getDownloadURL(ref(storage, `Webtoons/${webtoon}/Kapak/${webtoon}.jpeg`))
        .then(url => setKapakResmi(url))
        .catch(error => console.error("Kapak resmi alınamadı:", error));
    });
    
    listAll(ref(storage, `Webtoons/${webtoon}/Bölümler`))
      .then(dir => {
        const bolumler = dir.prefixes.map(folderRef => folderRef.name);
        setBolumler(bolumler);
      })
      .catch(error => console.error("Bölümler alınamadı:", error));
  }, [webtoon]);




  const goToWebtoonReadPage = (episode) => {
    navigation.navigate('WebtoonReadPage', { webtoon: webtoon, episode: episode });
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
      <ScrollView style={styles.scrollView}>
      {/* Orta Bölge */}
      <View style={styles.middleContent}>
        <Text style={styles.basliktitle}>{webtoon}</Text>
        {/* Kapak resmi */}
        {kapakResmi && <Image source={{ uri: kapakResmi }} style={styles.webtoonImage} />}
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Konusu</Text>
          <Text style={styles.infoText}>Webtoonun konusu buraya gelecek.</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.counterContainer}>
            <Image source={require('../../assets/İmage/HomePage_images/oku.png')} style={styles.counterIcon} />
            <Text style={styles.counterText}>Oku</Text>
          </View>
          <View style={styles.counterContainer}>
            <Image source={require('../../assets/İmage/HomePage_images/kaydet.png')} style={styles.counterIcon} />
            <Text style={styles.counterText}>5</Text>
          </View>
          <View style={styles.counterContainer}>
            <Image source={require('../../assets/İmage/HomePage_images/like.png')} style={styles.counterIcon} />
            <Text style={styles.counterText}>2</Text>
          </View>
          <View style={styles.counterContainer}>
            <Image source={require('../../assets/İmage/HomePage_images/yorum.png')} style={styles.counterIcon} />
            <Text style={styles.counterText}>6</Text>
          </View>
        </View>
      </View>

       {/* Bölümler */}
       <View style={styles.episodesContainer}>
          <Text style={styles.episodesTitle}>Bölümler</Text>
          {/* Bölüm butonları */}
          {bolumler.map((bolum, index) => (
            <TouchableOpacity
              key={index}
              style={styles.episodeButton}
              onPress={() => goToWebtoonReadPage(bolum)}
            >
              <Text style={styles.episodeButtonText}>{bolum}</Text>
            </TouchableOpacity>
          ))}
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
      {/* Bottom Navigation */}
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
  logoyazi: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  titleContainer: {
    
    alignItems: 'center',
  },
  
  basliktitle: {
    fontSize: 28,
    color: 'black',
    marginBottom:10,
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
  settingicon: {
    width: 35,
    height: 35,
  },
  bildirimicon: {
    width: 35,
    height: 35,
  },
  middleContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  webtoonImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  counterContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  counterIcon: {
    width: 30,
    height: 30,
  },
  counterText: {
    color: 'black',
  },
  episodesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  episodesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  episodeButton: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  episodeButtonText: {
    fontSize: 16,
    color: 'white',
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
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
});

export default WebtoonInfoPage;
