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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        color: '#ffb085',
    },
});

export default Loading;