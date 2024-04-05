import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image } from 'react-native';
import Loading from './Loading';

const LoginScreen = () => {
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSavePress = () => {
    setIsLoading(true);
    };

    return (
        <View style={styles.container}>
    <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/İmage/icon1.png')}
          style={styles.image}
        />
      </View>
    
          <TextInput
            placeholder='Kullanıcı Adı'
            style={styles.TextInputStyle}
            onChangeText={setName}
            value={name}
          />
           <TextInput
            placeholder='Şifre'
            style={styles.TextInputStyle}
            onChangeText={setLastName}
            value={lastname}
            />
          <Pressable
        onPress={handleSavePress}
        style={({ pressed }) => [{
          backgroundColor: pressed ? "gray" : "#8a1194"
        }, styles.button]}>
        <Text style={styles.buttonText}>Giriş</Text>
      </Pressable>
      {isLoading && <Loading />}

      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/İmage/3.jpeg')}
          style={styles.image_alt}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    TextInputStyle: {
      borderWidth: 1,
      width: '70%',
      height: 35,
      borderRadius: 10,
      marginVertical: 10,
      textAlign: 'center',
      fontSize: 18,
      margin: 15,
    },
    button: {
      borderWidth: 1,
      width: 125,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
    buttonText: {
      fontWeight: 'bold',
      color: 'white',
      fontSize: 18,
    },
    imageContainer: {
      alignItems: 'center',
      marginTop: 5,
    },
    image: {
      width: 200,
      height: 200,
      marginTop: 50,
      margin:25,
    },
    image_alt: {
      width: 410,
      height: 410,
      marginTop: 40,
    }
  });

  export default LoginScreen;