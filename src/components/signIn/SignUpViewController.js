import React, {useState, useEffect} from 'react';
import {
    View, SafeAreaView, TouchableOpacity, Text, TouchableWithoutFeedback, Image, TextInput,
    ScrollView, Alert,
} from 'react-native';
import {PLATFORM} from '../../utils/Enums';
import {Navigation} from 'react-native-navigation';
import BaseTextInput from '../baseComponents/BaseTextInput';
import {Colors} from '../../utils/styles';
import BaseButton from '../baseComponents/BaseButton';
import Utils from '../../utils/utils';

export default function SignUpViewController(props) {
    const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [pin, setPin] = useState('')

    const didClick = () => {
        if (!Utils.VerifyEmail(email)) {
            Alert('Email is incorrect!')
            return
        }

        // 只能输入由数字和26个英文字母组成的字符串："^[A-Za-z0-9]+$"。
        const usernamePattern = /^[A-Za-z0-9]+$/
        if (!usernamePattern.test(userName)) {
            alert('User name can only consist of a string of numbers and 26 letters!')
            return
        }

        if (!password.length) {
            alert('Password can\'t be empty!')
            return
        }

        if (!confirmPassword.length) {
            alert('ConfirmPassword can\'t be empty!')
            return
        }

        if (password !== confirmPassword) {
            alert('The passwords don\'t match.')
            return;
        }

     }

    const renderDismissButton = () => {
        return (
            <TouchableOpacity onPress={() => {
                if (PLATFORM.isIOS) {
                    Navigation.dismissModal(props.componentId)
                }else {
                    Navigation.pop(props.componentId)
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

    const renderCodeView = () => {
        return(
            <View style={{width: '100', flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                    <BaseTextInput
                        containerStyle={{marginTop: 20}}
                        title = {'Captcha#'}
                        placeholder={'6-digital pin'}
                        onChangeText={(text) => {
                            setPin(text)
                        }}
                    />
                </View>

                <TouchableOpacity style={{height: 40, width: 64,
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
                        setEmail(text)
                    }}
                />

                <BaseTextInput
                    containerStyle={{marginTop: 20}}
                    title = {'User Name#'}
                    placeholder={'Numbers and letters only...'}
                    onChangeText={(text) => {
                        setUserName(text)
                    }}
                />

                {renderCodeView()}

                <BaseTextInput
                    lineStyle={{backgroundColor: lineColor}}
                    containerStyle={{marginTop: 20}}
                    title = {'Password#'}
                    placeholder={'Enter your password'}
                    onChangeText={(text) => {
                        setPassword(text)
                    }}
                />

                <BaseTextInput
                    lineStyle={{backgroundColor: lineColor}}
                    containerStyle={{marginTop: 20}}
                    title = {'Confirmed Password#'}
                    placeholder={'Enter your confirmed password'}
                    secureTextEntry={true}
                    onChangeText={(text) => {
                        setConfirmPassword(text)
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
                                didClick()
                            }
                            }
                />
            </ScrollView>

            {renderDismissButton()}
        </SafeAreaView>
    )
}
