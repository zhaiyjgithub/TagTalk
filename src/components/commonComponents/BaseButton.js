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
            <View style={[{width: '100%', height: 48, backgroundColor: Colors.white}, containerStyle]}>
                <TouchableOpacity onPress={() => {
                    didClick && didClick()
                }} style={[{flex: 1,
                    backgroundColor: Colors.blue,
                    borderRadius: 4,
                    marginHorizontal: 24, justifyContent: 'center', alignItems: 'center'
                }, style]}>
                    <Text style={{fontSize: 18,
                        color: Colors.white, fontWeight: '700'
                    }}>{title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

}
