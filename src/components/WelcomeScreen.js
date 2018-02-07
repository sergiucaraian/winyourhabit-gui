import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Config from 'react-native-config';
import { Actions } from 'react-native-router-flux';
import { defaultText } from '../styles.js';
import Authentication from '../logic/Authentication';

class WelcomeScreen extends React.Component
{
    componentDidMount()
    {
        if(Authentication.isAuthenticated())
        {
            Actions.home();
        }
    }

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
                    <Text style={styles.title}>
                        {`Welcome to\nWin your Habit`}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={this._onPressLoginButton}>
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this._onPressRegisterButton}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
			</View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Config.DEFAULT_COLOR || '#494e6b',
    },
    titleContainer: {
        marginTop: 120,
        marginBottom: 220
    },
    title: {
        ...defaultText,
        fontSize: 45,
        textAlign: 'center'
    },
    buttonContainer: {
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 30
    },
    button: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 20
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 20,
        paddingTop: 12,
        paddingBottom: 12
    }
});


export default connect(null, null)(WelcomeScreen);
