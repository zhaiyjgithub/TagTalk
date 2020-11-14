import React, {Component} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {Colors} from '../../utils/styles';
import BaseTextInput from '../baseComponents/BaseTextInput';
import {Navigation} from 'react-native-navigation';
import {CacheKey, PLATFORM, ResponseCode} from '../../utils/Enums';
import {HTTP} from '../../utils/HttpTools';
import {API_User} from '../../utils/API';
import {Utils} from '../../utils/utils';
import BaseButton from '../baseComponents/BaseButton';
import ToastMsg from '../../utils/ToastMsg';
import CacheTool from '../../utils/CacheTool';
import LoadingSpinner from '../baseComponents/LoadingSpinner';
import {Router} from '../../route/routerMap';

export default class SignInViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isShowSpinner: false
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
            ToastMsg.show('Email can\'t be empty!')
            return
        }

        if (!password.length) {
            ToastMsg.show('Password can\'t be empty!')
            return
        }

        const param = {
            Email: email,
            Password: password
        }

        this.showSpinner()
        HTTP.post(API_User.Login, param).then((response) => {
            this.hideSpinner()
            if (response.code === ResponseCode.ok) {
                global.UserInfo = response.data
                CacheTool.save(CacheKey.userInfo, JSON.stringify(response.data))

                Router.showHomePage()
            }else {
                ToastMsg.show('Sign in Failed.')
            }
        }).catch((err) => {
            this.hideSpinner()
            ToastMsg.show('Request failed.')
        })
    }

    showSpinner() {
        this.setState({isShowSpinner: true})
    }

    hideSpinner() {
        this.setState({isShowSpinner: false})
    }

    render() {
        const {isShowSpinner} = this.state
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

                <LoadingSpinner visible={isShowSpinner}/>
            </SafeAreaView>
        )
    }
}
