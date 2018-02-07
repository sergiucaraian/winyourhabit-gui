import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';

class HomeScreen extends React.Component
{
    render()
    {
        return (
            <View>
                <Text>Home screen</Text>
            </View>
        );
    }
}

export default connect(null, null)(HomeScreen);
