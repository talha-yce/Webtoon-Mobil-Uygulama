import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const HomePage = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
            <Image source={require('../../assets/İmage/icon1.png')} style={styles.logo} />
            <Text style={styles.title}>DARKTON</Text>
          
        </View>
        <TouchableOpacity onPress={() => console.log("Ayarlar açıldı")}>
          <Image source={require('../../assets/İmage/icon1.png')} style={styles.settingicon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Bildirimler açıldı")}>
          <Image source={require('../../assets/İmage/icon1.png')} style={styles.bildirimicon} />
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
          <Image source={require('../../assets/İmage/icon1.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Keşfet tıklandı")}>
          <Image source={require('../../assets/İmage/icon1.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Kaydedilenler tıklandı")}>
          <Image source={require('../../assets/İmage/icon1.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Profil tıklandı")}>
          <Image source={require('../../assets/İmage/icon1.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    color: 'white',
    marginTop:-10,
    marginLeft:180,
  },
  logo: {
    marginRight: 10,
    width: 30,
    height: 30,
    marginLeft:150,
    marginTop:10,
  },
  settingicon: {
    width: 40,
    height: 40,
    marginLeft:5,
    marginTop:-60,
  },
  bildirimicon: {
    width: 40,
    height: 40,
    marginLeft:340,
    marginTop:-60,
  },
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: 'white',
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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default HomePage;