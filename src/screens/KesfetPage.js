import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const KesfetPage = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = ['Kategori1', 'Kategori2', 'Kategori3'];

  // Firestore'dan arama 
  const searchFromFirestore = async () => {
    console.log('Arama yapıldı');
    
  };

  const handleSearch = () => {
    searchFromFirestore();
  };

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    console.log(`Filtreleme yapıldı: ${category}`);
    navigation.navigate('KesfetWebtoonPage', { category: category });
  };

  const handleFilter = () => {
    setSelectedCategory(null); 
    console.log("Filtreleme sıfırlandı");
    
  };

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

      {/* Arama bölümü */}
      <View style={styles.searchContainer}>
        {/* Arama metni konteynerı */}
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
              <Image source={require('../../assets/İmage/HomePage_images/like.png')} style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
          
          
          <View style={styles.filterButtonContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
              <Image source={require('../../assets/İmage/HomePage_images/kaydet.png')} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      
      {searchResults.length > 0 && (
        <ScrollView style={styles.searchResultsContainer}>
          {searchResults.map((result, index) => (
            <Text key={index} style={styles.searchResultItem}>
              {result.title}
            </Text>
          ))}
        </ScrollView>
      )}

      
      <ScrollView style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategorySelection(category)}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingBottom: 15,
  },
  searchTextContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
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
    width: 20,
    height: 20,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  searchResultsContainer: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  searchResultItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  categoryContainer: {
    paddingHorizontal: 25,
    marginTop: 10,
  },
  categoryItem: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 16,
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

export default KesfetPage;
