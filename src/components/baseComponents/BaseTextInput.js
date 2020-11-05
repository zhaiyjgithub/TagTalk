import React, {useEffect, useState} from 'react';
import {View, Text, TextInput} from 'react-native'
import {Colors} from '../../utils/styles';

export default function BaseTextInput(props) {
    const {
        title = '',
        placeholder = '',
        onChangeText = '',
        keyboardType = 'default',
        style= {},
    } = props

    return(
        <View style={[{width: '100%', paddingHorizontal: 20,
            minHeight: 62
        }, style]}>
            <Text style={{fontSize: 14, color: Colors.blue,
            }}>{title}</Text>
            <TextInput
                keyboardType={keyboardType}
                onChangeText={(text) => {
                    onChangeText && onChangeText(text)
                }}
                clearButtonMode={'while-editing'}
                placeholder={placeholder}
                underlineColorAndroid={'transparent'}
                style={{height: 30, fontSize: 18,
                color: Colors.black, paddingVertical: 0, marginVertical: 8,
            }}/>

            <View style={{height: 1,
                backgroundColor: Colors.blue
            }}/>
        </View>
    )
}
