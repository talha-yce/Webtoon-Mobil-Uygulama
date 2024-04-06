import { StyleSheet,Text,View } from "react-native";
import React from "react";

const SignupPage=()=>{
    return(
        <View style={styles.container}>
        <Text>SignupPage</Text>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default SignupPage;