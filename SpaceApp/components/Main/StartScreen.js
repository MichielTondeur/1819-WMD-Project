import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, StatusBar } from 'react-native';

import HostButton from './HostButton';

export default class DashBoard extends Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#cccccc" hidden={true} />
                <HostButton navigate={this.props.navigation.navigate} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cccccc'
    }
});
