import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, TouchableOpacity, Text, TouchableWithoutFeedback, Image, TextInput} from 'react-native';
import {Colors} from '../../utils/styles';

export default function SignInViewController(props) {
    return (
        <SafeAreaView style={{flex: 1}}>
            <Text style={{fontSize: 32, marginTop: 20,
                marginHorizontal: 20, color: Colors.black,
                fontWeight: 'bold'
            }}>{'Sign in with your email.'}</Text>
        </SafeAreaView>
    )
}