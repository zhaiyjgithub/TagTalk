import React, {Component} from 'react';
import {Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {PLATFORM, ResponseCode} from '../../utils/Enums';
import {Navigation} from 'react-native-navigation';
import BaseTextInput from '../commonComponents/BaseTextInput';
import {Colors} from '../../utils/styles';
import BaseButton from '../commonComponents/BaseButton';
import {Utils} from '../../utils/utils';
import {HTTP} from '../../utils/HttpTools';
import {API_User} from '../../utils/API';
import LoadingSpinner from '../commonComponents/LoadingSpinner';
import ToastMsg from '../../utils/ToastMsg';

export default class SignUpViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            userName: '',
            confirmPassword: '',
            email: '',
            pin: '',
            isShowSpinner: false
        }
    }

    requestPin() {
        const {email} = this.state
        if (!Utils.VerifyEmail(email)) {
            ToastMsg.show('Email is incorrect!')
            return
        }
        const param = {
            Email: email
        }

        this.showSpinner()
        HTTP.post(API_User.SendSignUpPin, param).then((response) => {
            this.hideSpinner()
            if (response.code === ResponseCode.ok) {
                ToastMsg.show("Captcha has been sent to your email.")
            }else if (response.code === ResponseCode.isExist) {
                ToastMsg.show('This is email has been registered before.')
            } else {
                ToastMsg.show('Send failed.')
            }
        }).catch((err) => {
            this.hideSpinner()
            ToastMsg.show('Request failed')
        })
    }

    didClick() {
        const {email, userName, password, confirmPassword, pin} = this.state
        if (!Utils.VerifyEmail(email)) {
            ToastMsg.show('Email is incorrect!')
            return
        }

        // 只能输入由数字和26个英文字母组成的字符串："^[A-Za-z0-9]+$"。
        const usernamePattern = /^[A-Za-z0-9]+$/
        if (!usernamePattern.test(userName)) {
            ToastMsg.show('User name can only consist of a string of numbers and 26 letters!')
            return
        }

        if (!pin.length) {
            ToastMsg.show('Captcha can\'t be empty!')
            return
        }

        if (!password.length) {
            ToastMsg.show('Password can\'t be empty!')
            return
        }

        if (!confirmPassword.length) {
            ToastMsg.show('ConfirmPassword can\'t be empty!')
            return
        }

        if (password !== confirmPassword) {
            ToastMsg.show('The passwords don\'t match.')
            return;
        }

        const param = {
            Name: userName,
            Email: email,
            Password: password,
            Pin: pin
        }

        this.showSpinner()
        HTTP.post(API_User.RegisterNewDoctor, param).then((response) => {
            this.hideSpinner()
            if (response.code === ResponseCode.ok) {
                Alert.alert(
                    'Register successfully.',
                    'You can sign in now. ',
                    [
                        {text: 'Sign In', onPress: () => {
                                const {registerCb} = this.props
                                registerCb && registerCb(email)

                                if (PLATFORM.isIOS) {
                                    Navigation.dismissModal(this.props.componentId)
                                }else {
                                    Navigation.pop(this.props.componentId)
                                }
                            }},
                    ],
                    { cancelable: false }
                )
            }else {
                ToastMsg.show('Sign in failed!')
            }
            Utils.Log(JSON.stringify(response))
        }).catch((err) => {
            this.hideSpinner()
            ToastMsg.show(err)
        })
     }

    renderDismissButton() {
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

    renderCodeView() {
        return(
            <View style={{width: '100', flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                    <BaseTextInput
                        containerStyle={{marginTop: 20}}
                        title = {'Captcha#'}
                        placeholder={'6-digital pin'}
                        onChangeText={(text) => {
                            this.setState({pin: text})
                        }}
                    />
                </View>

                <TouchableOpacity onPress={() => {
                    this.requestPin()
                }} style={{height: 40, width: 64,
                    justifyContent: 'center', alignContent: 'center',
                    backgroundColor: Colors.blue,
                    marginRight: 20,
                    borderRadius: 4,
                }}>
                    <Text style={{fontSize: 18, color: Colors.white, textAlign: 'center'}}>{'Get'}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    showSpinner() {
        this.setState({isShowSpinner: true})
    }

    hideSpinner() {
        this.setState({isShowSpinner: false})
    }

    render() {
        const {confirmPassword, password, isShowSpinner} = this.state
        let isEqualPwd = confirmPassword === password
        let lineColor= confirmPassword.length ? (isEqualPwd ? Colors.green: Colors.red) : Colors.lineColor
        return(
            <SafeAreaView style={{flex:1,}}>
                <ScrollView style={{flex: 1}}>
                    <Text style={{fontSize: 32, marginVertical: 20,
                        marginHorizontal: 20, color: Colors.black,
                        fontWeight: 'bold'
                    }}>{'Sign up with your email.'}</Text>

                    <BaseTextInput
                        containerStyle={{marginTop: 20}}
                        keyboardType={'email-address'}
                        title = {'Email#'}
                        placeholder={'Enter your email'}
                        onChangeText={(text) => {
                            this.setState({email: text})
                        }}
                    />

                    <BaseTextInput
                        containerStyle={{marginTop: 20}}
                        title = {'User Name#'}
                        placeholder={'Numbers and letters only...'}
                        onChangeText={(text) => {
                            this.setState({userName: text})
                        }}
                    />

                    {this.renderCodeView()}

                    <BaseTextInput
                        lineStyle={{backgroundColor: lineColor}}
                        containerStyle={{marginTop: 20}}
                        title = {'Password#'}
                        placeholder={'Enter your password'}
                        onChangeText={(text) => {
                            this.setState({password: text})
                        }}
                    />

                    <BaseTextInput
                        lineStyle={{backgroundColor: lineColor}}
                        containerStyle={{marginTop: 20}}
                        title = {'Confirmed Password#'}
                        placeholder={'Enter your confirmed password'}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            this.setState({confirmPassword: text})
                        }}
                    />

                    <BaseButton title={'Create Now'}
                                style={{
                                    backgroundColor: Colors.blue,
                                }}
                                containerStyle={{
                                    marginTop: 20,
                                }}
                                didClick={() => {
                                    this.didClick()
                                }
                                }
                    />
                </ScrollView>

                {this.renderDismissButton()}

                <LoadingSpinner visible={isShowSpinner}/>
            </SafeAreaView>
        )
    }
}
