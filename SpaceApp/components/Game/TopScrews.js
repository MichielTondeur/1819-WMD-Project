import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';

var { height, width } = Dimensions.get('window');

export default class TopScrews extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{ ...styles.screw, ...styles.leftScrew }}
                    source={require('../../assets/screw.png')}
                />
                <Image
                    style={{ ...styles.screw, ...styles.rightScrew }}
                    source={require('../../assets/screw.png')}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    screw: {
        width: width / 13,
        height: width / 13,
        marginTop: 5
    },
    leftScrew: {
        marginLeft: 5
    },
    rightScrew: {
        marginRight: 5
    }
});
