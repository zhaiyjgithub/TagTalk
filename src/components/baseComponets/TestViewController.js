import React, {Component} from 'react';
import {View, SafeAreaView, TouchableOpacity, Text} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

export default class TestViewController extends Component{
	constructor(props) {
		super(props)
		this.offset = useSharedValue(0);
	}
	render() {
		const animatedStyles = useAnimatedStyle(() => {
			return {
				transform: [{ translateX: this.offset.value * 255 }],
			};
		});
		return (
			<SafeAreaView style={{flex: 1, }}>
				<Animated.View style={[{width: 100, height: 100, backgroundColor: 'blue'}, animatedStyles]}/>

				<TouchableOpacity onPress={() => {
					this.offset.value = Math.random()
				}} style={{marginTop: 100, }}>
					<Text>{'Click'}</Text>
				</TouchableOpacity>
			</SafeAreaView>
		)
	}
}
