import React, { useState, useEffect, } from "react"
import {SafeAreaView, Button, View, Text, Dimensions} from 'react-native'
import {Colors} from '../utils/styles';
import Animated,  {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
	useAnimatedGestureHandler,
	withSpring,
	interpolate,
	concat,
	withSequence
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler'
const {width} = Dimensions.get('window')

const AnimationViewController = (props) => {
	const translation = {
		x: useSharedValue(0),
		y: useSharedValue(0)
	}

	let isEnd = false

	const gestureHandler = useAnimatedGestureHandler({
		onStart:(_, ctx) => {
			ctx.startX = translation.x.value
			ctx.startY = translation.y.value
		},
		onActive: (event, ctx) => {
			translation.x.value = ctx.startX + event.translationX
			translation.y.value = ctx.startY + (event.translationY > 100 ? 100 : event.translationY)
		},
		onEnd: (event, ctx) => {
			translation.x.value = withSequence(withSpring(translation.x.value + 200, {}, () => {
				//这里表明了已经出去了可是范围， 那么card的opacity 已经设置到 0。
				isEnd = true
			}), withTiming(0, {
				duration: 100,
				easing: Easing.bezier(0.25, 0.1, 0.25, 1),
			}, () => {
				isEnd = false // 这个回到原点过程不需要根据translationX进行opacity 变化
				//这里创建一个渐变动画， 显示第二张图的opacity.
			}))
			translation.y.value = withSpring(0)
		}
	})

	const style = useAnimatedStyle(() => {
		const rotateZ = interpolate(translation.x.value, [-width/2.0, width/2.0], [15, -15], 'clamp') + 'deg'

		if (!isEnd) {//这个回到原点过程不需要根据translationX进行opacity 变化
			//这里使用translationX 用来计算card opacity。。。。
		}
		return {transform: [
			{translateX: translation.x.value,},
			{translateY: translation.y.value},
			{rotateZ: rotateZ}
			]}
	})

	const handlerStageChanged = ({nativeEvent}) => {
		console.log('hello: ' + nativeEvent.state)
	}

	return(
		<SafeAreaView style={{flex: 1, backgroundColor: Colors.white, alignItems: 'center'}}>
			<PanGestureHandler onHandlerStateChange={handlerStageChanged} onGestureEvent={gestureHandler}>
				<Animated.View style={[{width: 200, height: 380, backgroundColor: Colors.red}, style]}>

				</Animated.View>
			</PanGestureHandler>

		</SafeAreaView>
	)
}

export default AnimationViewController
