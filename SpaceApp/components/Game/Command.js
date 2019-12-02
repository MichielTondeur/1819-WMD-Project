import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Command extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.command}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 4,
        backgroundColor: '#000000',
        borderTopRightRadius: 19,
        borderTopLeftRadius: 19,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#FFF',
        fontSize: 22
    }
});
