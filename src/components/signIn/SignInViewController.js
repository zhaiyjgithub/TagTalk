import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, TouchableOpacity, Text, TouchableWithoutFeedback, Image, TextInput} from 'react-native';
import {Colors} from '../../utils/styles';
import BaseTextInput from '../baseComponents/BaseTextInput';

export default function SignInViewController(props) {
    return (
        <SafeAreaView style={{flex: 1}}>
            <Text style={{fontSize: 32, marginVertical: 20,
                marginHorizontal: 20, color: Colors.black,
                fontWeight: 'bold'
            }}>{'Sign in with your email.'}</Text>

            <BaseTextInput
                keyboardType={'email-address'}
                title = {'Email#'}
                placeholder={'Enter your email'}
                onChangeText={(text) => {

                }}
            />

            <BaseTextInput
                style={{marginTop: 20}}
                title = {'Password#'}
                placeholder={'Enter your password'}
                onChangeText={(text) => {

                }}
            />
        </SafeAreaView>
    )
}
