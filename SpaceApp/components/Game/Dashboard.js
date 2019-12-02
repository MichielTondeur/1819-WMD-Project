import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

import * as Progress from 'react-native-progress';
import AwesomeButton from 'react-native-really-awesome-button';

import TopScrews from './TopScrews';
import BottomScrews from './BottomScrews';
import Command from './Command';
import ActionButton from '../Actions/ActionButton';
import Light from './Light';

var { height, width } = Dimensions.get('window');

export default class DashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            command: 'Waiting...',
            gameStatus: '',
            progress: 1,
            error: 0,
            components: [],
            level: 2
        };
        const socket = this.props.navigation.getParam('socket');
        const gameStarter = this.props.navigation.getParam('gameStarter');

        if (gameStarter == true) {
            console.log('game begonnen');
            socket.emit('startGame', 1, this.props.navigation.getParam('room'));
        } else {
            console.log('game niet begonnen');
        }

        socket.on('win', () => {
            this.setState({ gameStatus: 'win' });
        });

        socket.on('nextLevel', () => {
            this.setState({
                command: 'Waiting...',
                gameStatus: '',
                progress: 1,
                error: 0,
                components: [],
                level: this.state.level + 1
            });
            this.animate();
        });

        socket.on('time', err => {
            this.setState(
                {
                    error: err
                },
                () => {
                    if (this.state.error == 3) {
                        socket.emit(
                            'lose',
                            this.props.navigation.getParam('room')
                        );
                    }
                }
            );
        });

        socket.on('lose', () => {
            this.setState({ gameStatus: 'lost' });
        });

        socket.on('components', components => {
            this.setState({ components });
        });

        socket.on('command', command => {
            this.setState({ command, progress: 1 });
        });
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        const interval = setInterval(() => {
            progress = this.state.progress - Math.random() / 50;
            if (progress <= 0) {
                socket.emit(
                    'time',
                    this.state.error,
                    this.props.navigation.getParam('room')
                );
                progress = 1;
            }
            this.setState({ progress });
            if (
                this.state.gameStatus === 'win' ||
                this.state.gameStatus === 'lost' ||
                this.state.gameStatus === 'victory' ||
                this.state.command == ''
            ) {
                console.log('clearing interval');
                clearInterval(interval);
            }
        }, 100);
    }

    render() {
        let components = [];
        const room = this.props.navigation.getParam('room');

        this.state.components.forEach(component => {
            let c = (
                <ActionButton
                    name={component.name}
                    buttonName={component.buttonCommand}
                    socket={socket}
                    room={room}
                />
            );
            components.push(c);
        });

        if (this.state.gameStatus === 'win' && this.state.level != 5) {
            return (
                <View style={styles.center}>
                    <AwesomeButton
                        backgroundColor={'#ee0000'}
                        backgroundDarker={'#bb0000'}
                        backgroundShadow={'#C0C0C0'}
                        textColor={'#F7F7F7'}
                        width={150}
                        onPress={() => {
                            socket.emit('nextLevel', room);
                            socket.emit('startGame', this.state.level, room);
                        }}
                    >
                        Next level!
                    </AwesomeButton>
                    <Image
                        style={styles.image}
                        source={require('../../assets/ufo.png')}
                    />
                </View>
            );
        } else if (this.state.gameStatus === 'win' && this.state.level == 5) {
            return (
                <View style={styles.center}>
                    <Text>
                        You arrived at your home planet! Congratulations!
                    </Text>
                    <Image
                        style={styles.image}
                        source={require('../../assets/planet.png')}
                    />
                </View>
            );
        } else if (this.state.gameStatus === 'lost') {
            return (
                <View style={styles.center}>
                    <Text>
                        Game over! Time ran out and your spaceship has crashed!
                    </Text>
                    <Image
                        style={styles.image}
                        source={require('../../assets/crash.png')}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <TopScrews />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingBottom: 5
                        }}
                    >
                        {this.state.error > 2 ? (
                            <Light color="red" />
                        ) : (
                            <Light />
                        )}
                        {this.state.error > 1 ? (
                            <Light color="red" />
                        ) : (
                            <Light />
                        )}
                        {this.state.error > 0 ? (
                            <Light color="red" />
                        ) : (
                            <Light />
                        )}
                    </View>
                    <View style={styles.content}>
                        <Command command={this.state.command} />
                        <Progress.Bar
                            progress={this.state.progress}
                            width={null}
                            height={15}
                            borderRadius={0}
                            animated={true}
                        />
                        <View
                            style={{
                                flex: 20,
                                backgroundColor: '#eeeeee',
                                borderBottomRightRadius: 19,
                                borderBottomLeftRadius: 19
                            }}
                        >
                            {components}
                        </View>
                    </View>
                    <BottomScrews />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#cccccc'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cccccc'
    },
    content: {
        flex: 18,
        backgroundColor: '#ffffff',
        marginLeft: width / 13,
        marginRight: width / 13,
        borderRadius: 25,
        borderWidth: 6,
        borderColor: '#7f7f7f',
        elevation: 4
    },
    image: {
        width: width / 3,
        height: width / 3,
        marginTop: 35
    }
});
