import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView,RefreshControl } from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { getDocs, collection, query,getDoc,doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; 
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme, DarkToonTheme } from '../components/ThemaStil';

const KesfetPage = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [webtoonsData, setWebtoonsData] = useState([]);
  const theme = useSelector(state => state.user.theme);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWebtoons();
  }, [webtoonsData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWebtoons();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setWebtoonsData([]);
      };
    }, [])
  );

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
    console.log(`Seçilen webtoon: ${webtoon}`);
    navigation.navigate('WebtoonInfoPage', { webtoon: webtoon });
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
  


  return (
    <View style={[styles.container, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.purpleStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.darkStil.backgroundColor }]}>
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

        <TouchableOpacity>
          <Text style={styles.bildirimicon} />
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
});

export default KesfetPage;
