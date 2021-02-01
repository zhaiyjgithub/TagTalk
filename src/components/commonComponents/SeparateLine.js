import React, {memo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../utils/styles';

const SeparateLine = memo(function SeparateLine(props) {
	const {style} = props
	return (
		<View style={[{
			position: 'absolute',
			height: 1,
			left: 20, right: 20,
			bottom: 0,
			backgroundColor: Colors.lineColor
		}, style]}/>
	)
})

export default SeparateLine
