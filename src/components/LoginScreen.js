import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';

class LoginScreen extends React.Component
{
    render()
    {
        return (
            <View>
				<Text>On the LOGIN screen. Welcome friend!</Text>
			</View>
        );
    }
}

export default connect(null, null)(LoginScreen);
