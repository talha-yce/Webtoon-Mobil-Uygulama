import React from 'react';
import { View, StyleSheet, Text,Image } from "react-native";

const Loading = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/İmage/HomePage_images/loading.gif')} style={styles.loadingImage} />
            <Text style={styles.loadingText} >
                Loading...
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#8a1194',
    },
    loadingText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        color: '#ffb085',
    },
    loadingImage: {
        width: 50,
        height: 50,
        alignSelf: 'center',
        marginTop: 10,
      },
});

export default Loading;