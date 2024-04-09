import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("PetrO");
  const [quote, setQuote] = useState("The worst to death, fake world Never lose your inner child 2020/4/20");
  const [newUsername, setNewUsername] = useState("");
  const [newQuote, setNewQuote] = useState("");

  const handleEditProfile = () => {
    if (editing) {
      const usernameIsEmpty = newUsername.trim() === '';
  
      if (usernameIsEmpty) {
        alert("Kullanıcı adı boş bırakılamaz.");
        return;
      }
  
      const updatedUsername = newUsername.trim();
      const updatedQuote = newQuote.trim().slice(0, 50); // Max 50 characters
      setUsername(updatedUsername);
      setQuote(updatedQuote);
      console.log("Kullanıcı bilgileri kaydedildi:", updatedUsername, updatedQuote);
      setEditing(false);
    } else {
      setNewUsername(username); // Set newUsername to current username
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

      {/* Profile Content */}
      <ScrollView style={styles.scrollView}>
        {/* Profile */}
        <View style={styles.section}>
          <View style={styles.profileSection}>
            <Image source={require('../../assets/İmage/HomePage_images/person.png')} style={styles.profileImage} />
            <TextInput
              style={styles.profileUsername}
              value={editing ? newUsername : username}
              onChangeText={(text) => {
                setNewUsername(text);
              }}
              placeholder={newUsername.trim() === '' ? "Kullanıcı Adı" : ""}
              placeholderTextColor="grey"
              editable={editing}
            />
            <View style={styles.profileCounters}>
              <View style={styles.counterContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/okunan.png')} style={styles.counterIcon} />
                <Text style={styles.counterText}>25</Text>
              </View>
              <View style={styles.counterContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/kaydet.png')} style={styles.counterIcon} />
                <Text style={styles.counterText}>36</Text>
              </View>
              <View style={styles.counterContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/like.png')} style={styles.counterIcon} />
                <Text style={styles.counterText}>86</Text>
              </View>
            </View>
            <TextInput
              style={styles.quoteText}
              value={editing ? newQuote : quote}
              onChangeText={handleQuoteChange}
              placeholder={newQuote.trim() === '' ? "Alıntı Metni" : ""}
              placeholderTextColor="grey"
              editable={editing}
              multiline={true}
            />
            <TouchableOpacity onPress={handleEditProfile}>
              <Text style={styles.editProfileButton}>{editing ? "Bilgileri Kaydet" : "Profili Düzenle"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* İçerik */}
        <View style={styles.section}>
          {/* OKUDUĞUN WEBTOONLAR */}
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Okuduğun Webtoonlar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[...Array(8)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => console.log("Sana özel webtoon gösterildi")}>
                  <View style={styles.personalWebtoon} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* KAYDETTİĞİN WEBTOONLAR */}
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Kaydettiğin Webtoonlar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[...Array(6)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => console.log("Trend webtoon gösterildi")}>
                  <View style={styles.trendingWebtoon} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* alt navigasyon bölümü */}
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
    maxHeight: 100, // Max height for quote text input
    textAlignVertical: 'top', // Start from the top
  },
  editProfileButton: {
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
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
