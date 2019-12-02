import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';

var { height, width } = Dimensions.get('window');

export default class Light extends Component {
    render() {
        const { color } = this.props;
        let light;

        if (color === 'red') {
            light = (
                <Image
                    style={styles.light}
                    source={require('../../assets/led-circle-red.png')}
                />
            );
        } else {
            light = (
                <Image
                    style={styles.light}
                    source={require('../../assets/led-circle-green.png')}
                />
            );
        }

        return <View style={styles.container}>{light}</View>;
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10
    },
    light: {
        width: width / 13,
        height: width / 13
    }
});
