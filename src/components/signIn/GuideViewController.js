import React, {Component} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../utils/styles';
import {PLATFORM} from '../../utils/Enums';
import {Navigation} from 'react-native-navigation';
import BaseButton from '../baseComponents/BaseButton';

export default class GuideViewController extends Component{
    didClick(type) {
        if (type === ActionType.create) {
            this.pushToSignUp()
        }else if (type === ActionType.signIn) {
            this.pushToSignIn()
        }
    }
    pushToSignIn (){
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

    pushToSignUp(){
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

    renderForgotPasswordButton(){
        return(
            <TouchableOpacity>
                <Text style={{color: Colors.blue, fontSize: 16, marginTop: 30}}>{'Forgot password?'}</Text>
            </TouchableOpacity>
        )
    }

    renderAppTitle(){
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

    render() {
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
                {this.renderAppTitle()}
                {this.renderForgotPasswordButton()}
                {buttons.map((item, index) => {
                    return <BaseButton key={index} title={item.title}
                                       style={{
                                           backgroundColor: item.bgColor,
                                       }}
                                       containerStyle={{
                                           marginTop: 20,
                                       }}
                                       didClick={() => {
                                           this.didClick(item.type)
                                       }
                                       }
                    />
                })}

            </SafeAreaView>
        )
    }
}

const ActionType = {
    create: 0,
    signIn: 1
}
