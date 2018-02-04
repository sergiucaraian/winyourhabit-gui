import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Provider, connect} from 'react-redux';
import {Scene, Actions, Router, Stack} from 'react-native-router-flux';

import ReduxRouter from './src/redux/ReduxRouter';
import HomeScreen from './src/components/HomeScreen';
import LoginScreen from './src/components/LoginScreen';

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
						<Scene key="login" component={LoginScreen} title="Login" />
						<Scene key="home" component={HomeScreen} />
					</Stack>
				</ReduxRouter>
			</Provider>
		);
	}
}
