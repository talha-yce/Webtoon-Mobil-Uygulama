import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image } from 'react-native';
import { CustomTextinput } from "../components";
import { useNavigation } from '@react-navigation/native';

const SignupPage=()=>{
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

      return (
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/İmage/icon1.png')}
                  style={styles.image}
                />
              </View>
      
      
              <View style={styles.bilgiContainer}>

              <TextInput
                  placeholder='Ad Soyad'
                  style={styles.TextInputStyle}
                  onChangeText={setEmail}
                  value={email}
                />

                <TextInput
                  placeholder='Kullanıcı Adı'
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
                  onPress={() => navigation.navigate('Login')}
                  style={({ pressed }) => [{
                  backgroundColor: pressed ? "gray" : "#8a1194"
                  }, styles.button]}>
                  <Text style={styles.buttonText}>Giriş</Text>
                </Pressable>
                <Pressable
                  onPress={() => console.log("Kaydet işlemi gerçekleşti")}
                  style={({ pressed }) => [{
                  backgroundColor: pressed ? "gray" : "#8a1194"
                  }, styles.button]}>
                  <Text style={styles.buttonText}>Kaydet</Text>
                </Pressable>
      
              </View>
     
            </View>

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
export default SignupPage;