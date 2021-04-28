import React from 'react';
import {View} from 'react-native';
import {Colors} from '../../utils/styles';

class SettingsViewController extends React.Component {
	static options(passProps) {
		return {
			topBar: {
				title: {
					text: 'Profile'
				},
				rightButtons: [
					{
						id: 'settings',
						enabled: true,
						disableIconTint: false,
						color: Colors.black,
						icon: require('../../source/image/profile/setting-two.png'),
					},
				]
			},
		};
	}
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
	}

	render() {
		return (<View />)
	}
}

export default SettingsViewController
