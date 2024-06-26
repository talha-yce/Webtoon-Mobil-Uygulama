import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/userSlice';
import { Loading } from '../components';
import { lightTheme, darkTheme,DarkToonTheme} from '../components/ThemaStil';

const SignupPage = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState(""); 
  const theme = useSelector(state => state.user.theme);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.user);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignup = () => {
    if (!validateEmail(email)) {
      setEmailError("Geçerli bir e-posta adresi girin!");
      return;
    } else {
      setEmailError("");
    }

    if (password !== passwordConfirm) { 
      setPasswordError("Şifreler eşleşmiyor!");
      return;
    } else {
      setPasswordError("");
    }

    dispatch(register({ name, email, password }));
  };



  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
       <ScrollView contentContainerStyle={[styles.scrollViewContent, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.toonStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/İmage/3.jpeg')}
            style={styles.image}
          />
        </View>

        <View style={[styles.bilgiContainer, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.whiteStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.greyStil.backgroundColor }]}>
          <Text style={{ width: '100%', fontWeight: 'bold', textAlign: 'left', fontSize: 28, marginLeft: '10%',marginBottom:10, }}>Sign up</Text>
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
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            placeholder='Şifre'
            secureTextEntry={true}
            style={styles.TextInputStyle}
            onChangeText={setPassword}
            value={password}
          />


          <TextInput
            placeholder='Şifreyi Tekrar Girin'
            secureTextEntry={true}
            style={styles.TextInputStyle}
            onChangeText={setPasswordConfirm}
            value={passwordConfirm}
          />


          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleSignup}

              style={({ pressed }) => [{
                backgroundColor: pressed ? "gray" : "#8a1194"
              }, styles.button]}>
              <Text style={styles.buttonText}>Kaydet</Text>
            </Pressable>
          </View>
</View>
<View style={styles.altnote}>
            <Pressable
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.altnotetext}>Mevcut bir hesabınız mı var? Login</Text>
            </Pressable>
          
          <Text style={{ color: 'red', marginBottom: 10 }}>{passwordError}</Text>
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
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius:15,
  },
  altnote: {
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center', 
  },
  altnotetext: {
    fontWeight:'bold',
    fontSize:16,
  },
  bilgiContainer: {
    flex: 1,
    alignItems: 'center',
    width: '80%',
   borderRadius:15,
   justifyContent: 'center',
  },
  buttonContainer: {
    
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
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
 
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignupPage;
