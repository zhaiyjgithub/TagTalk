import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {Colors} from '../../utils/styles';
import BaseTextInput from '../baseComponents/BaseTextInput';
import {Navigation} from 'react-native-navigation';
import {PLATFORM} from '../../utils/Enums';

export default class SignInViewController extends Comment{
    renderDismissButton(){
        return (
            <TouchableOpacity onPress={() => {
                if (PLATFORM.isIOS) {
                    Navigation.dismissModal(this.props.componentId)
                }else {
                    Navigation.pop(this.props.componentId)
                }
            }} style={{
                position: 'absolute',
                left: 20, bottom: 50,
                height: 44, width: 44,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image source={require('../../source/image/chat/close.png')} />
            </TouchableOpacity>
        )
    }

    render() {
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

                {this.renderDismissButton()}
            </SafeAreaView>
        )
    }
}
