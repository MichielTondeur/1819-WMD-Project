import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';

export default class HostButton extends Component {
    constructor(props) {
        super(props);
        this.state = { text: '', error: '' };
    }

    render() {
        const { navigate } = this.props;

        return (
            <View style={styles.container}>
                <AwesomeButton
                    style={{ marginBottom: 25 }}
                    backgroundColor={'#ee0000'}
                    backgroundDarker={'#bb0000'}
                    backgroundShadow={'#C0C0C0'}
                    textColor={'#F7F7F7'}
                    width={150}
                    onPress={() => {
                        if (this.state.text === '') {
                            this.setState({
                                error: `Room name can't be empty.`
                            });
                        } else {
                            navigate('LobbyScreen', { room: this.state.text });
                        }
                    }}
                >
                    Host Game!
                </AwesomeButton>
                <Text>Enter room name: </Text>
                <TextInput
                    style={{
                        height: 40,
                        width: 200,
                        borderColor: 'gray',
                        borderWidth: 1
                    }}
                    maxLength={20}
                    selectionColor={'#ee0000'}
                    textAlign={'center'}
                    onChangeText={text => this.setState({ text })}
                    value={this.state.text}
                />
                <Text style={styles.error}>{this.state.error}</Text>
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
        marginBottom: 20
    },
    error: {
        color: '#ff0000'
    }
});
