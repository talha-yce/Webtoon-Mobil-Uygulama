import React, { useState, useEffect, } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView,RefreshControl } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { getDocs, collection, query,getDoc,doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; 
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme, DarkToonTheme } from '../components/ThemaStil';

const KesfetPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {username, profileImage} = route.params;
  const [searchText, setSearchText] = useState('');
  const [webtoonsData, setWebtoonsData] = useState([]);
  const theme = useSelector(state => state.user.theme);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  

  useEffect(() => {
    fetchWebtoons();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWebtoons();
    setRefreshing(false);
  };


  const fetchWebtoons = async () => {
    try {
      const webtoonsSnapshot = await getDocs(collection(db, 'webtoonlar'));
      const webtoonsData = webtoonsSnapshot.docs.map(webtoonDoc => {
        const webtoonId = webtoonDoc.id;
        const webtoonData = webtoonDoc.data();
        return {
          adı: webtoonId,
          tur: webtoonData.tur || []
        };
      });
      setWebtoonsData(webtoonsData);
      setLoading(false);
    } catch (error) {
      console.error('Webtoonları getirirken hata oluştu:', error);
    }
  };
  

  const handleWebtoonSelect = (webtoon) => {
    
    navigation.navigate('WebtoonInfoPage', { webtoon: webtoon,username: username, profileImage: profileImage });
  };

  const handleSearch = async () => {
    try {
      if (searchText.trim() === '') {
        fetchWebtoons();
        return;
      }
      const webtoonDoc = await getDoc(doc(db, 'webtoonlar', searchText));
      if (webtoonDoc.exists()) {
        const webtoonData = webtoonDoc.data();
  
        const searchedWebtoons = [{
          adı: searchText,
          tur: webtoonData.tur || []
        }];
  
        setWebtoonsData(searchedWebtoons);
      } else {
        setWebtoonsData([]);
        
      }
     
    } catch (error) {
      console.error('Arama yapılırken hata oluştu:', error);
    }
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
    ? DarkToonTheme.purpleStil.backgroundColor: theme === 'lightTheme'
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

      <View style={[styles.searchContainer, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.toonStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]}>
        <View style={styles.searchTextContainer}>
          <TextInput
           style={[styles.searchInput, { backgroundColor: theme === 'DarkToon' 
           ? DarkToonTheme.greyStil.backgroundColor: theme === 'lightTheme'
             ? lightTheme.greyStil.backgroundColor
             : darkTheme.greyStil.backgroundColor }]}
            placeholder="Webtoon Ara..."
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
        
        <View style={styles.buttonsContainer}>
          <View style={styles.searchButtonContainer}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Image source={require('../../assets/İmage/HomePage_images/arama.png')} style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
          
         
        </View>
      </View>

      <ScrollView style={[styles.scrollView, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.toonStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]} refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading ? ( // Yükleme durumunu kontrol et
          <View style={styles.loadingContainer}>
          <Image source={require('../../assets/İmage/HomePage_images/loading.gif')} style={styles.loadingImage} />
          <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
        </View>
        ) : (
          webtoonsData.length > 0 ? (
            webtoonsData.map(webtoon => (
              <TouchableOpacity key={webtoon.adı} onPress={() => handleWebtoonSelect(webtoon.adı)}>
                <View style={[styles.webtoonContainer, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.whiteStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.greyStil.backgroundColor }]}>
          <Text style={styles.webtoonTitle}>{webtoon.adı}</Text>
          <View style={styles.turContainer}>
            {webtoon.tur.slice(0, 4).map((tur, index) => (
              <View key={index} style={styles.turBox}>
                <Text style={styles.turText}>{tur}</Text>
              </View>
            ))}
            {webtoon.tur.length > 4 && (
              <View style={styles.moreTurBox}>
                <Text style={styles.moreTurText}>+{webtoon.tur.length - 4} daha</Text>
              </View>
            )}
          </View>
        </View>
        </TouchableOpacity>
            ))
          ) : (
            <View style={styles.webtoonContainer}>
              <Text style={styles.webtoonTitle}>Aradığınız webtoon bulunamadı.</Text>
            </View>
          )
        )}
      </ScrollView>

      
      
      {/* Alt navigasyon */}
      <View style={[styles.bottomNav, { backgroundColor: theme === 'DarkToon' 
 ? DarkToonTheme.purpleStil.backgroundColor : theme === 'lightTheme'
 ? lightTheme.whiteStil.backgroundColor
 : darkTheme.darkStil.backgroundColor }]}>
 <TouchableOpacity onPress={() => navigation.navigate('Home', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/home_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/home.png') : require('../../assets/İmage/HomePage_images/home_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate('Kaydet', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/save_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/save.png') : require('../../assets/İmage/HomePage_images/save_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate('Kesfet', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/keşif_beyaz_aktif1.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/keşif_aktif.png') : require('../../assets/İmage/HomePage_images/keşif_beyaz_aktif.png')} style={styles.navIcon} />
 </TouchableOpacity>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 10,
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
 
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingBottom: 15,
    borderColor:'lightgray',
    borderWidth:0.5,
    
  },
  searchTextContainer: {
    flex: 1,
  },
  searchInput: {
    marginTop:10,
    backgroundColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    color:'black',
    fontWeight:'bold'
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  searchButtonContainer: {
    marginRight: 10,
  },
  filterButtonContainer: {
  },
  searchButton: {
    
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
 
  searchIcon: {
    width: 30,
    height: 30,
  },
  filterIcon: {
    width: 30,
    height: 30,
  },
  categoryContainer: {
    paddingHorizontal: 25,
    marginTop: 10,
  },
  
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  webtoonList: {
    backgroundColor: 'purple',
    borderRadius: 5,
    padding: 10,
  },
  webtoonItem: {
    paddingVertical: 5,
  },
  webtoonText: {
    color: 'white',
  },
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
   
  },
  webtoonContainer: {
    marginTop: 10,
    marginBottom:10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    backgroundColor:'white',

  },
  webtoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  turContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  turBox: {
    backgroundColor: 'purple',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  turText: {
    color: 'white',
  },
  moreTurBox: {
    backgroundColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  moreTurText: {
    color: 'white',
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
});

export default KesfetPage;
