import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image,SafeAreaView,ScrollView  } from 'react-native';
import Loading from '../components/Loading';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSavePress = () => {
    setIsLoading(true);
    };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/İmage/icon1.png')}
            style={styles.image}
          />
        </View>


        <View style={styles.bilgiContainer}>
          
          <TextInput
            placeholder='Email'
            style={styles.TextInputStyle}
            onChangeText={setEmail}
            value={email}
          />

        <TextInput
          placeholder='Şifre'
          secureTextEntry={true}
          style={styles.TextInputStyle}
          onChangeText={setPassword}
          value={password}
        />

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleSavePress}
            style={({ pressed }) => [{
            backgroundColor: pressed ? "gray" : "#8a1194"
            }, styles.button]}>
            <Text style={styles.buttonText}>Giriş</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Signup')}
            style={({ pressed }) => [{
            backgroundColor: pressed ? "gray" : "#8a1194"
            }, styles.button]}>
            <Text style={styles.buttonText}>Kaydol</Text>
          </Pressable>

        </View>
        
        
        
      </View>


        {isLoading && <Loading />}

      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/İmage/3.jpeg')}
          style={styles.image_alt}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      
      flex: 1,
      backgroundColor: '#fff',
      
    },
    imageContainer: {
      
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bilgiContainer:{
      
      flex:1,
      alignItems: 'center',
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      
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
     buttonContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '70%', 
    },
    button: {
      borderWidth: 1,
     width: '48%', 
     height: 40,
     borderRadius: 20,
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: 20,
    },
    buttonText: {
      fontWeight: 'bold',
      color: 'white',
      fontSize: 18,
    },
    
    image: {
      width: 200,
      height: 200,
      
    },
    image_alt: {
      width: 300,
      height: 300,
    }
  });

  export default LoginPage;