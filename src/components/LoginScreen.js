import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import { loginRequest } from '../redux/actions';
import { defaultText } from '../styles.js';
import Authentication from '../logic/Authentication';

const mapDispatchToProps = dispatch => ({
    onSubmit: ({ username, password, resolve, reject }) => dispatch(loginRequest(username, password, resolve, reject))
});

// Adding key to input to prevent an error caused by using {...input}. Try removing it and see what happes.
const usernameField = ({
    input, label, type, placeholder, meta: { touched, error, warrning }
}) => (
    <View>
        <FormLabel>Username</FormLabel>
        <FormInput {...input} autoCapitalize = 'none' placeholder={placeholder} inputStyle={styles.input} selectionColor={'#FFF'} onChangeText={input.onChange} />
        <FormValidationMessage>{error}</FormValidationMessage>
    </View>
);

const passwordField = ({
    input, label, type, placeholder, meta: { touched, error, warrning }
}) => (
    <View>
        <FormLabel>Password</FormLabel>
        <FormInput {...input} autoCapitalize = 'none' secureTextEntry={true} placeholder={placeholder} inputStyle={styles.input} onChangeText={input.onChange} />
        <FormValidationMessage>{error}</FormValidationMessage>
    </View>
);

class LoginScreen extends React.Component
{
    constructor(props)
    {
        super(props);

        this.submit = this.submit.bind(this);
    }

    componentDidMount()
    {
        if(Authentication.isAuthenticated())
        {
            Actions.home();
        }
    }

    submit(params)
    {
        return new Promise((resolve, reject) => {
            this.props.onSubmit({ ...params, resolve, reject });
        });
    }

    render()
    {
        return (
            <View style={styles.container}>
                <View style={styles.inputsContainer}>
                    <Field name="username" selectionColor={'#FFF'} component={usernameField} placeholder="Username" />
                    <Field name="password" selectionColor={'#FFF'} component={passwordField} placeholder="Password" />
                </View>
                <View style={styles.submitButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress={this.props.handleSubmit(this.submit)}>
                        <Text style={styles.buttonText}>Sign in</Text>
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
    inputsContainer:
    {
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: -250,
    },
    input:
    {
        color: '#FFF'
    },
    submitButtonContainer: {
        paddingLeft: 40,
        paddingRight: 40,
        marginTop: 50
    },
    button: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'white',
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 20,
        paddingTop: 12,
        paddingBottom: 12
    }
});

const ReduxLoginForm = reduxForm({
    form: 'login', 
    initialValues: {
        username: 'sergiu',
        password: '123123123',
    }
})(LoginScreen);
export default connect(null, mapDispatchToProps)(ReduxLoginForm);
