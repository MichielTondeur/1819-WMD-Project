import React, { Component } from 'react';
window.navigator.userAgent = 'react-native';

import Dashboard from './components/Game/Dashboard';
import StartScreen from './components/Main/StartScreen';
import LobbyScreen from './components/Lobby/LobbyScreen';

import { createStackNavigator, createAppContainer } from 'react-navigation';

const MainNavigator = createStackNavigator(
    {
        StartScreen: { screen: StartScreen },
        LobbyScreen: { screen: LobbyScreen },
        Dashboard: { screen: Dashboard }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
        }
    }
);

export default createAppContainer(MainNavigator);
