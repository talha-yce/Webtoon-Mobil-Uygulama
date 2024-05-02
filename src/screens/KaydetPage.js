import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; 
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme,DarkToonTheme} from '../components/ThemaStil';
const KaydetPage = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const theme = useSelector(state => state.user.theme);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'recorded'));
        const categoriesData = await Promise.all(categoriesSnapshot.docs.map(async doc => {
          const webtoonsSnapshot = await getDocs(collection(db, `recorded/${doc.id}/webtoons`));
          const webtoonsData = webtoonsSnapshot.docs.map(webtoonDoc => webtoonDoc.id);
          return {
            id: doc.id,
            webtoons: webtoonsData
          };
        }));
        
        setCategories(categoriesData);
      } catch (error) {
        console.error('Kategorileri getirirken hata oluştu:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (webtoon) => {
    console.log(`Seçilen webtoon: ${webtoon}`);
    navigation.navigate('WebtoonInfoPage', { webtoon: webtoon });
  };

  const handleSearch = () => {
    console.log('Arama yapıldı');
    // Firestore'dan arama işlemleri buraya eklenebilir.
  };

  const handleFilter = () => {
    console.log("Filtreleme sıfırlandı");
    // Filtreleme işlemleri buraya eklenebilir.
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
      <View style={styles.searchContainer}>
        <View style={styles.searchTextContainer}>
          <TextInput
            style={styles.searchInput}
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
          
          <View style={styles.filterButtonContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
              <Image source={require('../../assets/İmage/HomePage_images/filtre.png')} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {categories.map(category => (
          <View key={category.id} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.id}</Text>
            <View style={styles.webtoonList}>
              {category.webtoons.map(webtoon => (
                <TouchableOpacity 
                  key={webtoon} 
                  style={styles.webtoonItem} 
                  onPress={() => handleCategorySelect(webtoon)}
                >
                  <Text style={styles.webtoonText}>{webtoon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
  profileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingBottom: 15,
  },
  searchTextContainer: {
    flex: 1,
  },
  searchInput: {
    marginTop:10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 10,
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
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  filterButton: {
    backgroundColor: 'white',
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
});

export default KaydetPage;
