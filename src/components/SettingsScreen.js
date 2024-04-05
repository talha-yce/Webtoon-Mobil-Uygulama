import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch,ScrollView  } from 'react-native';

const SettingsScreen = () => {
  const [contentLanguage, setContentLanguage] = useState('Türkçe');
  const [resolution, setResolution] = useState('Düşük');

  const renderItem = (title, content) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>DARKTON</Text>
        <Text style={styles.subHeaderText}>Ayarlar</Text>
      </View>
      {/* Content */}
      <ScrollView style={styles.scrollView}>
      {/* ayarMenu */}
      <View style={styles.ayarMenu}>
        {renderItem("HESAP:", <Text>Petro 8290</Text>)}
        
        {renderItem("TAKMA AD:", <Text>Petro #8290</Text>)}
        {renderItem("SEÇENEKLER:", null)}
        {renderItem("Uygulama Dili:", 
          <TouchableOpacity style={styles.optionButton} onPress={() => setContentLanguage('Türkçe')}>
            <Text style={styles.optionButtonText}>{contentLanguage}</Text>
          </TouchableOpacity>
        )}
        {renderItem("Önbelleği Temizle:", <TouchableOpacity><Text>30-41 MB</Text></TouchableOpacity>)}
        {renderItem("Tema:", <TouchableOpacity><Text>Tema</Text></TouchableOpacity>)}
        {renderItem("BİLDİRİMLER:", null)}
        {renderItem("Servis Bildirimi", <Switch/>)}
        {renderItem("Güncel Yeni Bölüm", <Switch/>)} 
        {renderItem("Göz rahatlığı:", <Switch/>)}
        {renderItem("HAKKINDA:", null)}
        {renderItem("Fark Etme:", <TouchableOpacity><Text>Fark Etme</Text></TouchableOpacity>)}
        {renderItem("Yardım:", <TouchableOpacity><Text>Yardım</Text></TouchableOpacity>)}
        {renderItem("Kullanım Şekilleri:", <TouchableOpacity><Text>Kullanım Şekilleri</Text></TouchableOpacity>)}
      </View>
      </ScrollView>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>DARKTON</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subHeaderText: {
    fontSize: 20,
    color: 'white',
  },
  ayarMenu: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionButton: {
    paddingVertical: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionButtonText: {
    color: 'black',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  switchText: {
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: 'white',
  },
});

export default SettingsScreen;
