import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { query, where, getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../firebaseConfig'; // assuming you have a separate file for Firebase configurations
import * as ImagePicker from 'expo-image-picker';

const ProfilePage = () => {
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [quote, setQuote] = useState("");
  const [newname, setNewname] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [okunan, setOkunan] = useState(0); 
  const [kaydet, setKaydet] = useState(0); 
  const [like, setLike] = useState(0); 
  
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid; 
  
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log("User Data:", userData);
          setUsername(userData.name); 
          setQuote(userData.quote); 
          setProfileImage(userData.profileImage);
          setOkunan(userData.okunan || 0);
          setKaydet(userData.kaydet || 0); 
          setLike(userData.like || 0);
        });
      } else {
        console.log("Kullanıcı oturum açmamış.");
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handleEditProfile = async () => {
    if (editing) {
      if (newname.trim() === '') {
        Alert.alert("Kullanıcı adı boş bırakılamaz.");
        return;
      }
  
      try {
        const user = getAuth().currentUser;
  
        if (user) {
          const userId = user.uid;
  
          const q = query(collection(db, "users"), where("uid", "==", userId));
          const querySnapshot = await getDocs(q);
  
          querySnapshot.forEach(async (doc) => {
            const docRef = doc.ref;
            await updateDoc(docRef, {
              name: newname,
              quote: newQuote
            });
  
            console.log("Kullanıcı verileri güncellendi.");
            setUsername(newname);
            setQuote(newQuote);
            setEditing(false);
          });
        } else {
          console.log("Kullanıcı oturum açmamış.");
        }
      } catch (error) {
        console.error("Kullanıcı verilerini güncellemede hata oluştu:", error);
      }
    } else {
      setNewname(username);
      setNewQuote(quote);
      setEditing(true);
    }
  };

  const handleQuoteChange = (text) => {
    if (text.length > 50) {
      Alert.alert("Uyarı", "Maximum 50 karaktere izin verilmektedir.");
    } else {
      setNewQuote(text);
    }
  };

  const uploadProfileImage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const userId = getAuth().currentUser.uid;
      const storageRef = ref(storage, `users/${userId}/profileImage.jpg`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);
      setImageUrl(imageUrl);
      await updateProfileImageUrl(imageUrl); // Firestore'daki kullanıcı belgesini güncelle
      console.log("Profile image updated.");
    } catch (error) {
      console.error("Profil resmi yüklenirken hata oluştu:", error);
    }
  };

  const updateProfileImageUrl = async (imageUrl) => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;
          await updateDoc(docRef, {
            profileImage: imageUrl
          });
        });
  
        console.log("Firestore'daki profil resmi URL'si güncellendi.");
        setProfileImage(imageUrl); // Profil resmini güncelle
      } else {
        console.log("Kullanıcı oturum açmamış.");
      }
    } catch (error) {
      console.error("Firestore'daki profil resmi URL'sini güncellemede hata oluştu:", error);
    }
  };
  

  const changeProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Permission status:", status);
      if (status !== 'granted') {
        Alert.alert('Uyarı', 'Galeri erişimi reddedildi.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log("Image Picker result:", result);
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        await uploadProfileImage(imageUri);
      }
    } catch (error) {
      console.error('Profil resmi yükleme hatası:', error);
    }
  };

  return (
    <View style={styles.container}>
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
        <View style={styles.section}>
          <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => {
              if (editing) {
                changeProfileImage();
              } else {
                console.log("Profil düzenleme modu kapalı, fotoğraf değiştirme işlemi yapılamaz.");
              }
            }}>
              <Image source={profileImage ? {uri: profileImage} : require('../../assets/İmage/HomePage_images/person.png')} style={styles.profileImage} />
            </TouchableOpacity>
            <TextInput
              style={styles.profileUsername}
              value={editing ? newname : username}
              onChangeText={(text) => setNewname(text)}
              placeholder={editing ? "Kullanıcı Adı" : ""}
              placeholderTextColor="grey"
              editable={editing}
            />
            <View style={styles.profileCounters}>
            <View style={styles.counterContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/okunan.png')} style={styles.counterIcon} />
                <Text style={styles.counterText}>{okunan}</Text>
              </View>
              <View style={styles.counterContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/kaydet.png')} style={styles.counterIcon} />
                <Text style={styles.counterText}>{kaydet}</Text>
              </View>
              <View style={styles.counterContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/like.png')} style={styles.counterIcon} />
                <Text style={styles.counterText}>{like}</Text>
              </View>
            </View>
            <TextInput
              style={styles.quoteText}
              value={editing ? newQuote : quote}
              onChangeText={handleQuoteChange}
              placeholder={editing ? "Alıntı Metni" : ""}
              placeholderTextColor="grey"
              editable={editing}
              multiline={true}
            />
            <TouchableOpacity onPress={handleEditProfile}>
              <Text style={styles.editProfileButton}>{editing ? "Bilgileri Kaydet" : "Profili Düzenle"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Okuduğun Webtoonlar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[...Array(8)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => console.log("Okuduğun webtoon gösterildi")}>
                  <View style={styles.personalWebtoon} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Kaydettiğin Webtoonlar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[...Array(6)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => console.log("Kaydettiğin webtoon gösterildi")}>
                  <View style={styles.trendingWebtoon} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
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
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    backgroundColor: 'purple',
    marginBottom: 10,
    borderRadius: 75,
  },
  profileUsername: {
    alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileCounters: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
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
  quoteText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 20,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  editProfileButton: {
    backgroundColor: 'purple',
    color: '#ff9a82',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'purple',
    marginTop: 10,
  },
  contentSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  personalWebtoon: {
    width: 100,
    height: 150,
    backgroundColor: 'gray',
    marginRight: 10,
  },
  trendingWebtoon: {
    width: 100,
    height: 150,
    backgroundColor: 'gray',
    marginRight: 10,
  },
});

export default ProfilePage;
