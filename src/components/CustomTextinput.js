import { StyleSheet,Text,View,TextInput} from "react-native";
import React from "react";

const CustomTextinput=({isSecureText,onChangeText,value,placeholder})=>{
    return(
  
        <TextInput 
            style={styles.TextInputStyle}
            secureTextEntry={isSecureText}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={value}>
            
        </TextInput>
       
    );
}

const styles=StyleSheet.create({
   
    TextInputStyle: {
        borderWidth: 1,
        width: '70%',
        height: 35,
        borderRadius: 10,
        marginVertical: 10,
        textAlign: 'center',
        fontSize: 18,
        margin: 15,
      }
});

export default CustomTextinput;