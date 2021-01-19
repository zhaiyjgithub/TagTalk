import React, { useState, useEffect } from "react"
import {SafeAreaView, Button, View, Text, Dimensions} from 'react-native'
import {Colors} from '../utils/styles';
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
	useAnimatedGestureHandler,
	withSpring,
	interpolate,
	concat,

} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler'

const {width} = Dimensions.get('window')

const AnimationViewController = (props) => {
	const translation = {
		x: useSharedValue(0),
		y: useSharedValue(0)
	}

	const gestureHandler = useAnimatedGestureHandler({
		onStart:(_, ctx) => {
			ctx.startX = translation.x.value
			ctx.startY = translation.y.value
		},
		onActive: (event, ctx) => {
			translation.x.value = ctx.startX + event.translationX
			translation.y.value = ctx.startY + event.translationY
		},
		onEnd: (event, ctx) => {
			translation.x.value = withSpring(0)
			translation.y.value = withSpring(0)
		}
	})

	const style = useAnimatedStyle(() => {
		const rotateZ = interpolate(translation.x.value, [0, width/2.0], [0, 35], 'clamp') + 'deg'
		return {transform: [
			{translateX: translation.x.value,},
			{translateY: translation.y.value},
			{rotateZ: rotateZ}
			]}
	})

	return(
		<SafeAreaView style={{flex: 1, backgroundColor: Colors.white, alignItems: 'center'}}>
			<PanGestureHandler onGestureEvent={gestureHandler}>
				<Animated.View style={[{width: 200, height: 380, backgroundColor: Colors.red}, style]}>

				</Animated.View>
			</PanGestureHandler>

		</SafeAreaView>
	)
}

export default AnimationViewController
