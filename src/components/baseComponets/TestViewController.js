import React, {Component} from 'react';
import {View, SafeAreaView, TouchableOpacity, Text} from 'react-native';
import {Colors} from '../../utils/styles';

export default class TestViewController extends Component{
	constructor(props) {
		super(props)

	}
	render() {

		return (
			<SafeAreaView style={{flex: 1, backgroundColor: Colors.green}}>

			</SafeAreaView>
		)
	}
}
