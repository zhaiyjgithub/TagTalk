import React, {Component, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Colors, FontFamily} from '../../utils/styles';

export default class Separator extends Component{
	static defaultProps = {
		style: {}
	}
	render() {
		const {style} = this.props
		return(
			<View style={[{width: '100%', height: 1, backgroundColor: Colors.lineColor,
				position: 'absolute', left: 0, top: 0,
			}, style]}/>
		)
	}
}
