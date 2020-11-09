import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, TouchableOpacity, Text, TouchableWithoutFeedback, Image} from 'react-native';
import {Colors, FontFamily} from '../../utils/styles';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../utils/Navigator';

export default function GuideViewController() {
    const renderButton = (item) => {
        return(
            <View style={{width: '100%', height: 50, marginTop: 15}}>
                <TouchableOpacity onPress={() => {
                    const {type} = item
                    if (type === ActionType.create) {
                        pushToSignUp()
                    }
                }} style={{flex: 1,
                    backgroundColor: item.bgColor,
                    borderRadius: 4,
                    marginHorizontal: 20, justifyContent: 'center', alignItems: 'center'
                }}>
                    <Text style={{fontSize: 16, fontFamily: FontFamily.helvetica,
                        color: Colors.white
                    }}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
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

    const pushToSignUp = () => {
        // Navigation.showModal(this.props.componentId, {
        //     component: {
        //         name: 'SignUpViewController',
        //         passProps: {
        //
        //         },
        //         options:  {
        //             topBar: {
        //                 visible: false,
        //
        //             },
        //         }
        //     }
        // });

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
        			bottomTabs: {
        				visible: false,
        				drawBehind: false,
        			}
        		}
        	}
        }

        Navigation.showModal(layout)
    }

    const buttons = [{
        title: 'Sign In',
        type: ActionType.create,
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
            {buttons.map((item) => {
                return renderButton(item)
            })}

        </SafeAreaView>
    )
}

const ActionType = {
    create: 0,
    signIn: 1
}
