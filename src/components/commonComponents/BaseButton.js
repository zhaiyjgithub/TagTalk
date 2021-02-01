import React, {Component, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Colors, FontFamily} from '../../utils/styles';

export default class BaseButton extends Component{
    static defaultProps = {
        title:'Button',
        style: {},
        containerStyle: {},
        didClick: null
    }

    render() {
        const {didClick, containerStyle, style, title} = this.props
        return(
            <View style={[{width: '100%', height: 50, backgroundColor: Colors.white}, containerStyle]}>
                <TouchableOpacity onPress={() => {
                    didClick && didClick()
                }} style={[{flex: 1,
                    backgroundColor: Colors.blue,
                    borderRadius: 2,
                    marginHorizontal: 20, justifyContent: 'center', alignItems: 'center'
                }, style]}>
                    <Text style={{fontSize: 18, fontFamily: FontFamily.helvetica,
                        color: Colors.white, fontWeight: '500'
                    }}>{title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

}
