import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { registerRequest } from '../redux/actions';

const mapDispatchToProps = dispatch => ({
    onSubmit: ({ email, password }) => dispatch(registerRequest(email, password))
});

class RegisterScreen extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit()
    {
        this.props.onSubmit(this.state.email, this.state.password);

        this.setState({
            email: '',
            password: ''
        });
    }

    render()
    {
        return (
            <View>
                <View>
                    <TextInput value={this.state.email} onChangeText={this.handleChangeEmail} keyboardType="email-address" />
                    <TextInput value={this.state.password} onChangeText={this.handleChangePassword} secureTextEntry={true} />
                </View>
                <View>
                    <Button onPress={this.handleSubmit} title="Sign up" />
                </View>
            </View>
        );
    }
}

export default connect(null, mapDispatchToProps)(RegisterScreen);
