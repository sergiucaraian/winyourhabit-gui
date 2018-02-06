import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Provider, connect} from 'react-redux';
import {Scene, Actions, Router, Stack} from 'react-native-router-flux';

import ReduxRouter from './src/redux/ReduxRouter';
import WelcomeScreen from './src/components/WelcomeScreen';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import HomeScreen from './src/components/HomeScreen';

import Config from 'react-native-config';
import WinYourHabitClient from './src/services/api/WinYourHabitClient';

import reducers from './src/redux/reducers';
import saga from './src/redux/sagas';

const api = new WinYourHabitClient(Config.ENDPOINT_URL);
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
				<ReduxRouter>
					<Stack key="root">
						<Scene key="welcome" component={WelcomeScreen} />
						<Scene key="login" component={LoginScreen} title="Login" />
						<Scene key="register" component={RegisterScreen} title="Register" />
						<Scene key="home" component={HomeScreen} tilte="Home" />
					</Stack>
				</ReduxRouter>
			</Provider>
		);
	}
}
