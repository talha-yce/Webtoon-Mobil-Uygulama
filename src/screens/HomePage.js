import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,RefreshControl } from 'react-native';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme,DarkToonTheme} from '../components/ThemaStil';
const HomePage = () => {
  const navigation = useNavigation();
  const [webtoons, setWebtoons] = useState([]);
  const theme = useSelector(state => state.user.theme);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWebtoonData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWebtoonData();
    setRefreshing(false);
  };
  const fetchWebtoonData = async () => {
      try {
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
            ucuncuSonBolum:ucuncuSonBolum,
          });
        }

        setWebtoons(webtoonData);
      } catch (error) {
        console.error("Webtoon verileri alınamadı:", error);
      }
    };
  const handleWebtoonSelect = (webtoonName) => {
    console.log(`Seçilen webtoon: ${webtoonName}`);
    navigation.navigate('WebtoonInfoPage', { webtoon: webtoonName });
  };
  const goToWebtoonReadPage = (episode,webtoon) => {
    navigation.navigate('WebtoonReadPage', { webtoon: webtoon, episode: episode });
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
      <ScrollView style={styles.scrollView} refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yeni</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {webtoons.map((webtoon, index) => (
              <TouchableOpacity key={index} onPress={() => handleWebtoonSelect(webtoon.webtoonName)}>
                <View style={styles.newWebtoon}>
                  <View style={styles.newWebtoonLeft}>
                    <Image source={{ uri: webtoon.kapakURL }} style={styles.webtoonImageyeni} />
                  </View>
                  <View style={styles.newWebtoonRight}>
                    <Text style={styles.webtoonTitle}>{webtoon.webtoonName}</Text>
                    <View style={styles.webtoonButtons}>
                      {webtoon.sonBolum && (
                        <TouchableOpacity onPress={() => goToWebtoonReadPage(webtoon.sonBolum,webtoon.webtoonName)} style={[styles.webtoonButton, { marginBottom: 5 }]}>
                          <Text style={styles.buttonText}>{webtoon.sonBolum}</Text>
                        </TouchableOpacity>
                      )}
                      {webtoon.ikinciSonBolum && (
                        <TouchableOpacity onPress={() => goToWebtoonReadPage(webtoon.ikinciSonBolum,webtoon.webtoonName)} style={styles.webtoonButton}>
                          <Text style={styles.buttonText}>{webtoon.ikinciSonBolum}</Text>
                        </TouchableOpacity>
                      )}
                      {webtoon.ucuncuSonBolum && (
                        <TouchableOpacity onPress={() => goToWebtoonReadPage(webtoon.ucuncuSonBolum,webtoon.webtoonName)} style={styles.webtoonButton}>
                          <Text style={styles.buttonText}>{webtoon.ucuncuSonBolum}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sana Özel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sana Özel</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {webtoons.slice(0, 8).map((webtoon, index) => (
              <TouchableOpacity key={index} onPress={() =>handleWebtoonSelect(webtoon.webtoonName)}>
                <View style={styles.personalWebtoon}>
                  <Image source={{ uri: webtoon.kapakURL }} style={styles.webtoonImageozel} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trend</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {webtoons.slice(0, 6).map((webtoon, index) => (
              <TouchableOpacity key={index} onPress={() => handleWebtoonSelect(webtoon.webtoonName)}>
                <View style={styles.trendingWebtoon}>
                  <Image source={{ uri: webtoon.kapakURL }} style={styles.webtoonImagetrend} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      {/* Alt navigasyon */}
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
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  section: {
    marginTop: 5,
    marginBottom:20,
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
  },
  newWebtoonLeft: {
    width: 150, 
  },
  newWebtoonRight: {
    width: 125, 
    alignItems:'center',
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
    alignItems:'center',
  },
  webtoonButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    margin: 10,
    width:75, 
    height: 20, 
    alignItems:'center',
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
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 10,
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
});

export default HomePage;
