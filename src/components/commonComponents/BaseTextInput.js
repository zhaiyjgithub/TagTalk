import React, {Component, useState} from 'react';
import {View, Text, TextInput} from 'react-native'
import {Colors} from '../../utils/styles';

export default class BaseTextInput extends Component{
    static defaultProps = {
        title:'',
        lineStyle: {},
        containerStyle: {marginTop: 20},
        textInputStyle: {},
    }

    render() {
        const {
            title = '',
            lineStyle,
            containerStyle,
            textInputStyle,
        } = this.props

        return(
            <View style={[{with: '100%', paddingHorizontal: 20,
                minHeight: 62, marginTop: 20
            }, containerStyle]}>
                <Text style={{fontSize: 14, color: Colors.blue,
                }}>{title}</Text>
                <TextInput
                    {...this.props}
                    clearButtonMode={'while-editing'}
                    style={[{height: 30, fontSize: 18,
                        color: Colors.black, paddingVertical: 0, marginVertical: 8}, textInputStyle]}
                />

                <View style={[{height: 1,
                    backgroundColor: Colors.lineColor
                }, lineStyle]}/>
            </View>
        )
    }
}

export const KeyboardType = {
    default: 'default',
    numberPad: 'number-pad',
    decimalPad: 'decimal-pad',
    numeric: 'numeric',
    email: 'email-address',
    phone: 'phone-pad'
};
