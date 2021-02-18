import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {PLATFORM} from '../../utils/Enums';
import {Navigation} from 'react-native-navigation';

const NavigatorDismissButton = (props) => {
	const {componentId, type = NavigationType.modal} = props
	return (
		<TouchableOpacity onPress={() => {
			if (PLATFORM.isIOS && type === NavigationType.modal) {
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
			<Image style={{width: 40, height: 40, transform: [
					{rotateZ: type === NavigationType.modal ? '-90deg' : '0deg'}
				]}} source={require('../../source/image/base/arrow-circle-left.png')} />
		</TouchableOpacity>
	)
}

export default NavigatorDismissButton

export const NavigationType = {
	modal: 0,
	push: 1
}



