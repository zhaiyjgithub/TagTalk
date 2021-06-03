import React from 'react';
import {Dimensions} from 'react-native';
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import {PanGestureHandler, PinchGestureHandler} from 'react-native-gesture-handler';
import ContainerView from '../baseComponents/ContainerView';

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
			translation.x.value = ctx.startX + event.translationX //(event.translationX > maxTranslationX ? maxTranslationX : (event.translationX))
			translation.y.value = ctx.startY + event.translationY
		},
		onEnd: (event, ctx) => {
			const translationX = translation.x.value
			const translationY = translation.y.value

			const maxTranslationX = (((imageScale.value - 1.0)*width)/2.0)
			const maxTranslationY = (((imageScale.value - 1.0)*width)/2.0)

			//For X-axis
			if (translationX > 0) { // 右滑动
				if (translationX*imageScale.value > maxTranslationX) {
					translation.x.value = withSpring(maxTranslationX/imageScale.value)
				}
			}else {// 左滑动
				if (Math.abs(translationX)*imageScale.value > maxTranslationX) {
					translation.x.value = withSpring(-maxTranslationX/imageScale.value)
				}
			}

			//For Y-axis
			if (translationY > 0) { // 右滑动
				if (translationY*imageScale.value > maxTranslationY) {
					translation.y.value = withSpring(maxTranslationY/imageScale.value)
				}
			}else {// 左滑动
				if (Math.abs(translationY)*imageScale.value > maxTranslationY) {
					translation.y.value = withSpring(-maxTranslationY/imageScale.value)
				}
			}

		}
	})

	const onPinchGestureEvent = useAnimatedGestureHandler({
		onStart:(_, ctx) => {
		},
		onActive: (event, ctx) => {
			const {scale} = event
			const newValue = imageScale.value*scale
			if (newValue >= 0.7 && newValue < 3.5) {
				imageScale.value = withTiming(Math.sqrt(newValue))
			}
		},
		onEnd: () => {
			if (imageScale.value <= 1.0) {
				imageScale.value = withTiming(1.0)
				translation.x.value = withTiming(0)
				translation.y.value = withTiming(0)
			}
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
