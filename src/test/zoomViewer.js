import React, { useState, useEffect, } from "react"
import {SafeAreaView, TouchableOpacity, View, Image, Dimensions} from 'react-native'
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
	withSequence, exp,
	multiply
} from 'react-native-reanimated';
import {PanGestureHandler, State, PinchGestureHandler} from 'react-native-gesture-handler'
import ContainerView from '../baseComponents/ContainerView';
const {width} = Dimensions.get('window')

const ZoomViewer = (props) => {
	const {width, height} = Dimensions.get('window')

	const imageScale = useSharedValue(1)
	const translation = {
		x: useSharedValue(0),
		y: useSharedValue(0)
	}

	const onPanGestureEvent = useAnimatedGestureHandler({
		onStart:(_, ctx) => {
			ctx.startX = translation.x.value
			ctx.startY = translation.y.value
		},
		onActive: (event, ctx) => {
			if (imageScale.value > 1.0) {

				translation.x.value = ctx.startX + event.translationX //(event.translationX > maxTranslationX ? maxTranslationX : (event.translationX))
				translation.y.value = ctx.startY + event.translationY
				console.log('on active translationX: ', translation.x.value)
			}
		},
		onEnd: (event, ctx) => {
			console.log('on end translationX: ', translation.x.value)
			const maxTranslationX = (((imageScale.value - 1.0)*width)/2.0)
			console.log('max translationX: ', maxTranslationX)
			if (translation.x.value*imageScale.value > maxTranslationX) {
				translation.x.value = withSpring(maxTranslationX/imageScale.value)
			}
		}
	})

	const onPinchGestureEvent = useAnimatedGestureHandler({
		onStart:(_, ctx) => {
		},
		onActive: (event, ctx) => {
			const {scale} = event
			const newValue = imageScale.value*scale
			if (newValue >= 0.7 && newValue < 2.5) {
				imageScale.value = newValue
			}
		},
		onEnd: () => {
			if (imageScale.value < 1.0) {
				imageScale.value = withTiming(1.0)
			}

			console.log('image scale value: ', imageScale.value)
		}
	})

	const imageStyle = useAnimatedStyle(() => {
		return {transform: [
				{scale: imageScale.value},
				{translateX: translation.x.value,},
				{translateY: translation.y.value},
			]}
	})


	const size = width
	return (
		<ContainerView style={{justifyContent: 'center', alignItems: 'center'}}>
			<PanGestureHandler onGestureEvent={onPanGestureEvent}>
				<Animated.View style={{width: size, height: size}}>
					<PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
						<Animated.Image style={[{width: size, height: size, }, imageStyle]} source={{uri: `https://picsum.photos/id/${10 + 10}/400/400`}}/>
					</PinchGestureHandler>
				</Animated.View>
			</PanGestureHandler>

		</ContainerView>
	)
}

export default ZoomViewer
