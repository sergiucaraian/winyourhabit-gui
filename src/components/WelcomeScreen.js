import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Button } from 'react-native';
import Config from 'react-native-config';
import { Actions } from 'react-native-router-flux';
import { defaultText } from '../styles.js';

class WelcomeScreen extends React.Component
{
    _onPressLoginButton()
    {
        Actions.login();
    }

    _onPressRegisterButton()
    {
        Actions.register();
    }

    render()
    {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Welcome!</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} onPress={this._onPressLoginButton} title="Log in" />
                    <Button style={styles.button} onPress={this._onPressRegisterButton} title="Sign up" />
                </View>
			</View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Config.DEFAULT_COLOR || '#24292e',
    },
    titleContainer: {
        marginBottom: 250
    },
    title: {
        ...defaultText,
        fontSize: 50,
        textAlign: 'center'
    },
    buttonContainer: {
        paddingLeft: 25,
        paddingRight: 25
    },
    button: {
        backgroundColor: '#2196F4',
        marginBottom: 20
    }
});


export default connect(null, null)(WelcomeScreen);
