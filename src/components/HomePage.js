import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const HomePage = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        
         <TouchableOpacity onPress={() => console.log("Ayarlar açıldı")}>
          <Image source={require('../../assets/İmage/HomePage_images/settings.png')} style={styles.settingicon} />
        </TouchableOpacity>

        <View style={styles.logoyazi}>
            <Image source={require('../../assets/İmage/HomePage_images/icon1.png')} style={styles.logo} />
            <View style={styles.titleContainer}>
            <Text style={styles.title}>DARK</Text>
            <Text style={styles.subtitle}>TON</Text>
          </View>
        </View>
       
        <TouchableOpacity onPress={() => console.log("Bildirimler açıldı")}>
          <Image source={require('../../assets/İmage/HomePage_images/bildirim.png')} style={styles.bildirimicon} />
        </TouchableOpacity>
      </View>

      {/* yeni Webtoonlar Bölümü*/}
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yeni</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            
            {[...Array(10)].map((_, index) => (
              <View key={index} style={styles.newWebtoon} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sana Özel</Text>
          {/* Sana Özel Bölümüü*/}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(8)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => console.log("Sana özel webtoon gösterildi")}>
                <View style={styles.personalWebtoon} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trend</Text>
          {/* tREND Webtoon bölümü */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(6)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => console.log("Trend webtoon gösterildi")}>
                <View style={styles.trendingWebtoon} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* alt navigaysyon bölümu*/}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => console.log("Ana Sayfa tıklandı")}>
          <Image source={require('../../assets/İmage/HomePage_images/home.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Keşfet tıklandı")}>
          <Image source={require('../../assets/İmage/HomePage_images/keşif.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Kaydedilenler tıklandı")}>
          <Image source={require('../../assets/İmage/HomePage_images/save.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Profil tıklandı")}>
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
    paddingTop:20,
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
    left:37,
    top:-5,
  },
  logoyazi:{
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
  },
  horizontalScroll: {
    marginTop: 10,
  },
  newWebtoon: {
    width: 100,
    height: 150,
    backgroundColor: 'gray',
    marginRight: 10,
  },
  personalWebtoon: {
    width: 150,
    height: 200,
    backgroundColor: 'gray',
    marginRight: 10,
  },
  trendingWebtoon: {
    width: 150,
    height: 200,
    backgroundColor: 'gray',
    marginRight: 10,
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

export default HomePage;