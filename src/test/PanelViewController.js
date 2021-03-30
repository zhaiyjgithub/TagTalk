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
const {width, height} = Dimensions.get('window')


const PanelViewController = (props) => {
	const {bottomSnapPoint, topSnapPoint} = props
	const translation = {
		y: useSharedValue(bottomSnapPoint.y)
	}

	const gestureHandler = useAnimatedGestureHandler({
		onStart:(_, ctx) => {
			ctx.startY = translation.y.value
		},
		onActive: (event, ctx) => {
			translation.y.value = ctx.startY + event.translationY
		},
		onEnd: (event, ctx) => {
			const positionY = translation.y.value
			let endPosition = bottomSnapPoint.y
			if (positionY < topSnapPoint.y) {
				endPosition = topSnapPoint.y
			}
			translation.y.value = withSpring(endPosition)
		}
	})

	const style = useAnimatedStyle(() => {
		return {transform: [
				{translateY: translation.y.value},
			]}
	})

	const handlerStageChanged = ({nativeEvent}) => {
		console.log('hello: ' + nativeEvent.state)
	}

	return(
		<View style={{flex: 1, backgroundColor: Colors.white, justifyContent: 'flex-end'}}>
			<PanGestureHandler onHandlerStateChange={handlerStageChanged} onGestureEvent={gestureHandler}>
				<Animated.View style={[{width: '100%', height: '100%', backgroundColor: Colors.red}, style]}>

				</Animated.View>
			</PanGestureHandler>

		</View>
	)
}

PanelViewController.defaultProps = {
	bottomSnapPoint: {
		y: height*0.8
	},
	topSnapPoint: {
		y: height*0.3
	}
}

export default PanelViewController
