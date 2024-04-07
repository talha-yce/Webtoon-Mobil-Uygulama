import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";

const Loading = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={'large'} color={'#ffb085'} />
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
});

export default Loading;