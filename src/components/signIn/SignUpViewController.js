import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, TouchableOpacity, Text, TouchableWithoutFeedback, Image, TextInput} from 'react-native';
import {Colors} from '../../utils/styles';

export default function SignUpViewController() {
    const renderBaseTextInput = (placeholder) => {
       return (
           <View style={{width: '100%', height: 50, marginTop: 20,}}>
               <TextInput
                   placeholder={placeholder}
                   underlineAndroid ={'transparent'}
                   style={{
                   flex: 1, height: 50, marginHorizontal: 30, borderRadius: 4,
                   borderRightWidth: 1, borderColor: Colors.lineColor,
                   backgroundColor: Colors.systemGray,
                       textAlign: 'left', paddingVertical: 0, paddingLeft: 5
               }}/>
           </View>
       )
    }
    return(
        <SafeAreaView style={{flex:1,}}>
            <Text style={{marginLeft: 20, marginTop: 20, fontWeight:  'bold', fontSize: 28,
                color: Colors.black,
            }}>{'Create New Account.'}</Text>

            {renderBaseTextInput('User Name')}
            {renderBaseTextInput('Email')}
            {renderBaseTextInput('User Name')}
        </SafeAreaView>
    )
}
