import React from 'react';
import { StyleSheet } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Provider, connect} from 'react-redux';
import {Scene, Actions, Router, Stack, Drawer} from 'react-native-router-flux';

import ReduxRouter from './src/redux/ReduxRouter';
import WelcomeScreen from './src/components/WelcomeScreen';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import HomeScreen from './src/components/HomeScreen';
import GroupScreen from './src/components/GroupScreen';
import DrawerContent from './src/components/DrawerContent';
import MenuIcon from './src/assets/menu.png';

import Config from 'react-native-config';
import WinYourHabitClient from './src/services/api/WinYourHabitClient';

import reducers from './src/redux/reducers';
import saga from './src/redux/sagas';

const api = new WinYourHabitClient(Config.ENDPOINT_URL || 'https://winyourhabit.herokuapp.com/');
global.api = api;

const sagaMiddlewareInstance = createSagaMiddleware({
	context: { api }
});

const store = createStore(
	reducers,
	applyMiddleware(sagaMiddlewareInstance),
);

sagaMiddlewareInstance.run(saga);

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<ReduxRouter navigationBarStyle={styles.navBar} titleStyle={styles.navTitle} >
					<Stack key="root">
						<Scene key="welcome" component={WelcomeScreen} hideNavBar />
						<Scene key="login" component={LoginScreen} title="Login" hideNavBar />
						<Scene key="register" component={RegisterScreen} title="Register" hideNavBar />
						<Drawer key="drawer" contentComponent={DrawerContent} drawerWidth={300} hideNavBar drawerImage={MenuIcon} leftButtonIconStyle={{ tintColor: 'white' }}>
							<Scene key="home" component={HomeScreen} title="My Groups" />
							<Scene key="group" component={GroupScreen} title="Group" />
						</Drawer>
					</Stack>
				</ReduxRouter>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	navBar: {
		backgroundColor: Config.DEFAULT_COLOR || '#494e6b'
	},
	navTitle: {
		color: '#FFF'
	}
});
