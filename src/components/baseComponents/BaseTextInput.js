import React, {useEffect, useState} from 'react';
import {View, Text, TextInput} from 'react-native'
import {Colors} from '../../utils/styles';

export default function BaseTextInput(props) {
    const {
        title = '',
        lineStyle= {},
        containerStyle= {marginTop: 20},
        style= {height: 30, fontSize: 18,
            color: Colors.black, paddingVertical: 0, marginVertical: 8,},
    } = props

    return(
        <View style={[{width: '100%', paddingHorizontal: 20,
            minHeight: 62
        }, containerStyle]}>
            <Text style={{fontSize: 14, color: Colors.blue,
            }}>{title}</Text>
            <TextInput style={style}
                       clearButtonMode={'while-editing'}
                       {...props} />

            <View style={[{height: 1,
                backgroundColor: Colors.lineColor
            }, lineStyle]}/>
        </View>
    )
}
