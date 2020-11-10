import React, {Component} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {Colors} from '../../utils/styles';
import BaseTextInput from '../baseComponents/BaseTextInput';
import {Navigation} from 'react-native-navigation';
import {PLATFORM} from '../../utils/Enums';
import {HTTP} from '../../utils/HttpTools';
import {API_User} from '../../utils/API';
import {Utils} from '../../utils/utils';
import BaseButton from '../baseComponents/BaseButton';

export default class SignInViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

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

    logIn() {
        const {email, password} = this.state

        if (!email.length) {
            alert('Email can\'t be empty!')
            return
        }

        if (!password.length) {
            alert('Password can\'t be empty!')
            return
        }

        const param = {
            Email: email,
            Password: password
        }

        HTTP.post(API_User.Login, param).then((response) => {
            Utils.Log(JSON.stringify(response))
        }).catch((err) => {
            Utils.Log(err)
        })
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
                        this.setState({email: text})
                    }}
                />

                <BaseTextInput
                    title = {'Password#'}
                    placeholder={'Enter your password'}
                    onChangeText={(text) => {
                        this.setState({password: text})
                    }}
                />

                <BaseButton
                            title={'Log In'}
                            style={{
                                backgroundColor: Colors.blue,
                            }}
                            containerStyle={{
                                marginTop: 20,
                            }}
                            didClick={() => {
                                this.logIn()
                            }
                            }
                />

                {this.renderDismissButton()}
            </SafeAreaView>
        )
    }
}
