import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';

window.navigator.userAgent = 'react-native';
import io from 'socket.io-client';

export default class LobbyScreen extends Component {
    constructor(props) {
        super(props);
        const socket = '';
        this.state = { room: '', players: [], error: '' };
    }

    componentDidMount() {
        this.setState({ room: this.props.navigation.getParam('room') });
        const { navigate } = this.props.navigation;

        //socket = io('http://192.168.1.4:3001', {
        socket = io('https://space-application-server.herokuapp.com/', {
            jsonp: false,
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('connected to server');
            socket.emit('join', this.state.room);
        });

        socket.on('connect_timeout', timeout => {
            console.log(timeout);
        });

        socket.on('connect_error', error => {
            console.log(error);
        });

        socket.on('error', error => {
            console.log(error);
        });

        socket.on('players', players => {
            this.setState({ players });
        });

        socket.on('roomFull', error => {
            this.setState({ error });
        });

        socket.on('start', gameStarter => {
            console.log(gameStarter);
            if (gameStarter == true) {
                navigate('Dashboard', {
                    socket,
                    gameStarter: true,
                    room: this.state.room
                });
            } else {
                navigate('Dashboard', { socket, room: this.state.room });
            }
        });
    }

    render() {
        let startButton =
            Object.keys(this.state.players).length == 2 ? (
                <AwesomeButton
                    backgroundColor={'#ee0000'}
                    backgroundDarker={'#bb0000'}
                    backgroundShadow={'#C0C0C0'}
                    textColor={'#F7F7F7'}
                    width={150}
                    onPress={() => socket.emit('start', this.state.room)}
                >
                    Start Game!
                </AwesomeButton>
            ) : null;

        return (
            <View style={styles.container}>
                <Text>Currently in room: {this.state.room}</Text>
                <Text>{this.state.error}</Text>
                {Object.keys(this.state.players).map(player => {
                    return <Text>{player}</Text>;
                })}
                {startButton}
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
