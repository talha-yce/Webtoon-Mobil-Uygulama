import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image,SafeAreaView,ScrollView  } from 'react-native';
import { CustomTextinput } from "../components";
import { useNavigation } from '@react-navigation/native';

const SignupPage=()=>{
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

      return (
        <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.imageContainer}>
                
                <Image
                  source={require('../../assets/İmage/3.jpeg')}
                  style={styles.image}
                />
              </View>
      
      
              <View style={styles.bilgiContainer}>
              <Text style={{width:'100%', fontWeight:'bold',textAlign:'left',fontSize:28,marginLeft:'10%'}}>Sign up</Text>
              <TextInput
                  placeholder='Ad Soyad'
                  style={styles.TextInputStyle}
                  onChangeText={setName}
                  value={name}
                />

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
                  onPress={() => console.log("Kaydet işlemi gerçekleşti, ad:",name," email:",email)}
                  style={({ pressed }) => [{
                  backgroundColor: pressed ? "gray" : "#8a1194"
                  }, styles.button]}>
                  <Text style={styles.buttonText}>Kaydet</Text>
                </Pressable>
                <Pressable 
                  onPress={() => navigation.navigate('Login')}>
                  <Text style={{fontWeight:'bold'}}>Mevcut bir hesabınız mı var? Login</Text>
                </Pressable>
                
              </View>
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
            width:'100%',
            flex:1,
            alignItems: 'center',
            justifyContent: 'center',
            // borderWidth: 1,
          },
          bilgiContainer:{
            width:'100%',
            flex:3,
            alignItems: 'center',
           // borderWidth: 1,
          },
          buttonContainer: {
            flex:2,
            justifyContent: 'space-between', 
            width: '100%', 
            alignItems: 'center',
           // borderWidth: 1,
          },
          scrollViewContent: {
            flexGrow: 1,
            justifyContent: 'center',
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
            width: 300,
            height: 300,
          },
          
        });
export default SignupPage;