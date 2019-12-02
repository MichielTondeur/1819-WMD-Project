import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';

export default class ActionButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { socket, name, room } = this.props;
        socket.emit('action', name, room);
    }

    render() {
        const { name, buttonName } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.instrumentName}>{name}</Text>
                <AwesomeButton
                    backgroundColor={'#ee0000'}
                    backgroundDarker={'#bb0000'}
                    backgroundShadow={'#C0C0C0'}
                    textColor={'#F7F7F7'}
                    width={150}
                    height={40}
                    onPress={() => this.handleClick()}
                >
                    {buttonName}
                </AwesomeButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    instrumentName: {
        fontSize: 20,
        color: '#000',
        textTransform: 'uppercase',
        marginBottom: 10
    }
});
