import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { getDownloadURL, ref, listAll, } from 'firebase/storage';
import { storage,db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme, DarkToonTheme } from '../components/ThemaStil';
import { getAuth } from "firebase/auth";
import { getDoc, doc } from 'firebase/firestore';

const HomePage = () => {
  const navigation = useNavigation();
  const [webtoons, setWebtoons] = useState([]);
  const theme = useSelector(state => state.user.theme);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchData();
    fetchWebtoonData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    await fetchWebtoonData();
   
    setRefreshing(false);
  };

  const fetchData = async () => {
    try {
    const user = getAuth().currentUser;
    if (user) {
      const userId = user.uid; 
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUsername(userData.name); 
        setProfileImage(userData.profileImage);
      }
    }
  }catch (error) {
      console.error('Kullanıcı bilgileri getirirken hata oluştu:', error);
    }
    }

  const fetchWebtoonData = async () => {
    try {
      setLoading(true);
      const webtoonsRef = ref(storage, 'Webtoons');
      const webtoonsList = await listAll(webtoonsRef);

      const firstTenWebtoons = webtoonsList.prefixes.slice(0, 10);
      const webtoonData = [];

      for (const webtoonRef of firstTenWebtoons) {
        const webtoonName = webtoonRef.name;
        let kapakURL = null;
        try {
          kapakURL = await getDownloadURL(ref(storage, `Webtoons/${webtoonName}/Kapak/${webtoonName}.jpg`));
        } catch (error) {
          try {
            kapakURL = await getDownloadURL(ref(storage, `Webtoons/${webtoonName}/Kapak/${webtoonName}.jpeg`));
          } catch (error) {
            try {
              kapakURL = await getDownloadURL(ref(storage, `Webtoons/${webtoonName}/Kapak/${webtoonName}.png`));
            } catch (error) {
              console.error("Kapak resmi alınamadı:", error);
            }
          }
        }

        const bolumlerDir = await listAll(ref(storage, `Webtoons/${webtoonName}/Bölümler`));
        const bolumler = bolumlerDir.prefixes.map(folderRef => folderRef.name);
        const sonBolum = bolumler[bolumler.length - 1];
        const ikinciSonBolum = bolumler.length > 1 ? bolumler[bolumler.length - 2] : null;
        const ucuncuSonBolum = bolumler.length > 2 ? bolumler[bolumler.length - 3] : null;
        webtoonData.push({
          webtoonName: webtoonName,
          kapakURL: kapakURL,
          sonBolum: sonBolum,
          ikinciSonBolum: ikinciSonBolum,
          ucuncuSonBolum: ucuncuSonBolum,
        });
      }

      setWebtoons(webtoonData);
      setLoading(false);
    } catch (error) {
      console.error("Webtoon verileri alınamadı:", error);
    }
  };

  const handleWebtoonSelect = (webtoonName) => {
    navigation.navigate('WebtoonInfoPage', { webtoon: webtoonName,username: username, profileImage: profileImage });
  };

  const goToWebtoonReadPage = (episode, webtoon) => {
    navigation.navigate('WebtoonReadPage', { webtoon: webtoon, episode: episode,username: username, profileImage: profileImage });
  };

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    
    const messages = [
      { startHour: 0, endHour: 6, message: 'Gece kuşu musun? İyi Geceler!' },
      { startHour: 6, endHour: 9, message: 'Keyifli okumalar.' },
      { startHour: 9, endHour: 12, message: 'Webtoon zamanı.' },
      { startHour: 12, endHour: 14, message: 'Yeni bölümler seni bekliyor.' },
      { startHour: 14, endHour: 17, message: 'Ara ver ve biraz oku.' },
      { startHour: 17, endHour: 19, message: 'Hikayelere devam.' },
      { startHour: 19, endHour: 21, message: 'Rahatla ve oku.' },
      { startHour: 21, endHour: 24, message: 'Güzel rüyalar.' },
    ];
  
    const messageObj = messages.find(({ startHour, endHour }) => currentHour >= startHour && currentHour < endHour);
  
    return messageObj ? messageObj.message : 'Bir hata oluştu!';
  };
  
  
  

  return (
    <View style={[styles.container, { backgroundColor: theme === 'DarkToon' 
      ? DarkToonTheme.purpleStil.backgroundColor : theme === 'lightTheme'
        ? lightTheme.whiteStil.backgroundColor
        : darkTheme.darkStil.backgroundColor }]}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profil', { username: username, profileImage: profileImage })}>
            <Image source={{ uri: profileImage }} style={styles.profilePicture} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>{getGreetingMessage()}</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/settings_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/settings.png') : require('../../assets/İmage/HomePage_images/settings_beyaz.png')} style={styles.settingicon} />
 </TouchableOpacity>
      </View>
      
      <ScrollView style={[styles.scrollView, { backgroundColor: theme === 'DarkToon' 
        ? DarkToonTheme.toonStil.backgroundColor : theme === 'lightTheme'
          ? lightTheme.whiteStil.backgroundColor
          : darkTheme.koyugrayStil.backgroundColor }]} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

        <View style={styles.section}>
          <View style={[styles.contentSection, { backgroundColor: theme === 'DarkToon' 
            ? DarkToonTheme.whiteStil.backgroundColor : theme === 'lightTheme'
              ? lightTheme.whiteStil.backgroundColor
              : darkTheme.greyStil.backgroundColor }]}>
            <Text style={styles.sectionTitle}>Yeni</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/loading.gif')} style={styles.loadingImage} />
                <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {webtoons.map((webtoon, index) => (
                  <TouchableOpacity key={index} onPress={() => handleWebtoonSelect(webtoon.webtoonName)}>
                    <View style={[styles.newWebtoon, { backgroundColor: theme === 'DarkToon' 
                      ? DarkToonTheme.toonStil.backgroundColor : theme === 'lightTheme'
                        ? lightTheme.whiteStil.backgroundColor
                        : darkTheme.koyugrayStil.backgroundColor }]}>
                      <View style={styles.newWebtoonLeft}>
                        <Image source={{ uri: webtoon.kapakURL }} style={styles.webtoonImageyeni} />
                      </View>
                      <View style={styles.newWebtoonRight}>
                        <Text style={styles.webtoonTitle}>{webtoon.webtoonName}</Text>
                        <View style={styles.webtoonButtons}>
                          {webtoon.sonBolum && (
                            <TouchableOpacity onPress={() => goToWebtoonReadPage(webtoon.sonBolum, webtoon.webtoonName)} style={[styles.webtoonButton, { marginBottom: 5 }]}>
                              <Text style={styles.buttonText}>{webtoon.sonBolum}</Text>
                            </TouchableOpacity>
                          )}
                          {webtoon.ikinciSonBolum && (
                            <TouchableOpacity onPress={() => goToWebtoonReadPage(webtoon.ikinciSonBolum, webtoon.webtoonName)} style={styles.webtoonButton}>
                              <Text style={styles.buttonText}>{webtoon.ikinciSonBolum}</Text>
                            </TouchableOpacity>
                          )}
                          {webtoon.ucuncuSonBolum && (
                            <TouchableOpacity onPress={() => goToWebtoonReadPage(webtoon.ucuncuSonBolum, webtoon.webtoonName)} style={styles.webtoonButton}>
                              <Text style={styles.buttonText}>{webtoon.ucuncuSonBolum}</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.contentSection, { backgroundColor: theme === 'DarkToon' 
            ? DarkToonTheme.whiteStil.backgroundColor : theme === 'lightTheme'
              ? lightTheme.whiteStil.backgroundColor
              : darkTheme.greyStil.backgroundColor }]}>
            <Text style={styles.sectionTitle}>Sana Özel</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/loading.gif')} style={styles.loadingImage} />
                <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {webtoons.slice(0, 8).map((webtoon, index) => (
                  <TouchableOpacity key={index} onPress={() => handleWebtoonSelect(webtoon.webtoonName)}>
                    <View style={styles.personalWebtoon}>
                      <Image source={{ uri: webtoon.kapakURL }} style={styles.webtoonImageozel} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.contentSection, { backgroundColor: theme === 'DarkToon' 
            ? DarkToonTheme.whiteStil.backgroundColor : theme === 'lightTheme'
              ? lightTheme.whiteStil.backgroundColor
              : darkTheme.greyStil.backgroundColor }]}>
            <Text style={styles.sectionTitle}>Trend</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/loading.gif')} style={styles.loadingImage} />
                <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {webtoons.slice(0, 6).map((webtoon, index) => (
                  <TouchableOpacity key={index} onPress={() => handleWebtoonSelect(webtoon.webtoonName)}>
                    <View style={styles.trendingWebtoon}>
                      <Image source={{ uri: webtoon.kapakURL }} style={styles.webtoonImagetrend} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Alt navigasyon */}
      <View style={[styles.bottomNav, { backgroundColor: theme === 'DarkToon' 
 ? DarkToonTheme.purpleStil.backgroundColor : theme === 'lightTheme'
 ? lightTheme.whiteStil.backgroundColor
 : darkTheme.darkStil.backgroundColor }]}>
 <TouchableOpacity onPress={() => navigation.navigate('Home', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/home_aktif_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/home_aktif.png') : require('../../assets/İmage/HomePage_images/home_beyaz_aktif.png')} style={styles.navIcon} />
 </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate('Kaydet', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/save_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/save.png') : require('../../assets/İmage/HomePage_images/save_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate('Kesfet', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/keşif_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/keşif.png') : require('../../assets/İmage/HomePage_images/keşif_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
</View>

    </View>
  );
};

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
    paddingBottom: 10,
    paddingTop: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginTop:5,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffb685',
  },
  username: {
    fontSize: 14,
    color: '#ffb685',
  },
  settingicon: {
    width: 35,
    height: 35,
    marginTop:10,
  },
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  section: {
    marginTop: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  horizontalScroll: {
    marginTop: 10,
  },
  newWebtoon: {
    flexDirection: 'row',
    width: 275,
    height: 200,
    backgroundColor: 'gray',
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  newWebtoonLeft: {
    width: 150,
  },
  newWebtoonRight: {
    width: 125,
    alignItems: 'center',
  },
  webtoonImageyeni: {
    width: 150,
    height: 200,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'lightgray',
  },
  webtoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  webtoonButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  webtoonButton: {
    backgroundColor: 'purple',
    borderRadius: 5,
    margin: 10,
    width: 75,
    height: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  personalWebtoon: {
    width: 150,
    height: 200,
    backgroundColor: 'gray',
    marginRight: 10,
    borderRadius: 10,
  },
  trendingWebtoon: {
    width: 150,
    height: 200,
    backgroundColor: 'gray',
    marginRight: 10,
    borderRadius: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 27,
    borderWidth: 1,
    margin: 15,
    position: 'absolute',
    bottom: 0,
    width: '92%',
  },
  navIcon: {
    width: 35,
    height: 35,
  },
  webtoonImageozel: {
    width: 150,
    height: 200,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'lightgray',
  },
  webtoonImagetrend: {
    width: 150,
    height: 200,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'lightgray',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingImage: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 5,
    marginTop: 5,
    borderWidth: 1,
  },
});

export default HomePage;
