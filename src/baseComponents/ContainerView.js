import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {Colors} from '../utils/styles';

export default class ContainerView extends Component{
	static defaultProps = {
		children: null,
		style: {}
	}

	render() {
		const {children, style} = this.props
		return(
			<SafeAreaView style={[{flex: 1, backgroundColor: Colors.white}, style]}>
				{children}
			</SafeAreaView>
		)
	}
}
