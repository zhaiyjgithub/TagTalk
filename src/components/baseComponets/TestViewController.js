import React, {Component} from 'react';
import {View, SafeAreaView, TouchableOpacity, Text} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

export default function TestController(props) {
	return(
		<SafeAreaView style={{flex: 1, backgroundColor: 'red'}}></SafeAreaView>
	)
}