import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {PLATFORM} from '../../utils/Enums';
import {Navigation} from 'react-native-navigation';

const NavigatorDismissButton = (props) => {
	const {componentId} = props
	return (
		<TouchableOpacity onPress={() => {
			if (PLATFORM.isIOS) {
				Navigation.dismissModal(componentId)
			}else {
				Navigation.pop(componentId)
			}
		}} style={{
			position: 'absolute',
			left: 20, bottom: 50,
			height: 44, width: 44,
			justifyContent: 'center',
			alignItems: 'center',
		}}>
			<Image source={require('../../source/image/chat/close.png')} />
		</TouchableOpacity>
	)
}

export default NavigatorDismissButton


