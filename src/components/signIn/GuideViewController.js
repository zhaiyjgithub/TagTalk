import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, TouchableOpacity, Text, TouchableWithoutFeedback, Image} from 'react-native';
import {Colors, FontFamily} from '../../utils/styles';
import {PLATFORM} from '../../utils/Enums';
import {Navigation} from 'react-native-navigation'
import BaseButton from '../baseComponents/BaseButton';

export default function GuideViewController() {
    const didClick = (type) => {
        if (type === ActionType.create) {
            pushToSignUp()
        }else if (type === ActionType.signIn) {
            pushToSignIn()
        }
    }

    const pushToSignIn = () => {
        let layout = {
        	component: {
        		name: 'SignInViewController',
        		passProps: {

        		},
        		options: {
        			modalPresentationStyle: 'fullScreen',
        			topBar: {
        				visible: false,
        			},
        		}
        	}
        }

        if (PLATFORM.isIOS) {
        	Navigation.showModal(layout)
        }else {
        	Navigation.push(this.props.componentId, layout);
        }
    }

    const pushToSignUp = () => {
        let layout = {
            component: {
                name: 'SignUpViewController',
                passProps: {

                },
                options: {
                    modalPresentationStyle: 'fullScreen',
                    topBar: {
                        visible: false,
                    },
                }
            }
        }

        if (PLATFORM.isIOS) {
            Navigation.showModal(layout)
        }else {
            Navigation.push(this.props.componentId, layout);
        }
    }

    const renderForgotPasswordButton = () => {
        return(
            <TouchableOpacity>
                <Text style={{color: Colors.blue, fontSize: 16, marginTop: 30}}>{'Forgot password?'}</Text>
            </TouchableOpacity>
        )
    }

    const renderAppTitle = () => {
        return(
            <View style={{position: 'absolute',
                right: 20,
                left: 20, top: '30%'
            }}>
                <Image style={{width: 60, height: 60, borderRadius: 30,
                    backgroundColor: Colors.black,
                }}/>

                <Text style={{fontSize: 33, color: Colors.black, marginTop: 30}}>{'Welcome, \nDiscover more like-minded people.'}</Text>
            </View>
        )
    }

    const buttons = [{
        title: 'Sign In',
        type: ActionType.signIn,
        bgColor: Colors.blue,
    },{
        title: 'Create New Account',
        type: ActionType.create,
        bgColor: Colors.black,
    }]

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.white,
            alignItems: 'center', flexDirection: 'column-reverse'
        }}>
            {renderAppTitle()}
            {renderForgotPasswordButton()}
            {buttons.map((item, index) => {
                return <BaseButton key={index} title={item.title}
                                   style={{
                                       backgroundColor: item.bgColor,
                                   }}
                                   containerStyle={{
                                        marginTop: 20,
                                   }}
                                   didClick={() => {
                                       didClick(item.type)
                                   }
                                   }
                />
            })}

        </SafeAreaView>
    )
}

const ActionType = {
    create: 0,
    signIn: 1
}
