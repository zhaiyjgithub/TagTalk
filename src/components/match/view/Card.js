import React, {memo, useEffect, useState} from 'react';
import {Dimensions, Image, SafeAreaView, View} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {
	interpolate,
	runOnJS,
	useAnimatedGestureHandler,
	useAnimatedStyle, useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import MatchService from '../MatchService';
const {width, height} = Dimensions.get('window')

const Position = {
	origin: 0,
	edge: 1,
	mid: 2,
}

const MaxEdgePositionX = (width - 60 + 100)

const CardSize = {
	width: (width - 60),
	height: height*0.6
}

export {
	CardSize
}



const Card = memo(function Card(props) {



	const [selectedImageIndex, setSelectedImageIndex] = useState(0)
	const [frontViewZIndex, setFrontViewZIndex] = useState(101)
	const [bgViewZIndex, setBgViewZIndex] = useState(100)
	const [bgImageIndex, setBgImageIndex] = useState(1)
	const matchService: MatchService = new MatchService()
	const currentUserInfo = global.UserInfo
	const translation = {
		x: useSharedValue(0),
		y: useSharedValue(0)
	}
	const springConfig = {
		damping: 15,
		mass: 0.5,
		stiffness: 100,
		overshootClamping: false,
		restSpeedThreshold: 1,
		restDisplacementThreshold: 0.5,
	}

	let moveStep = useSharedValue(0)
	let position = useSharedValue(Position.origin)
	let gestureState = useSharedValue(State.UNDETERMINED)


	const gestureCompleteHandler = () => {
		const {completeHandler, cardIndex} = props
		completeHandler && completeHandler(cardIndex)
	}

	const gestureHandler = useAnimatedGestureHandler({
		onStart:(_, ctx) => {
			ctx.startX = translation.x.value
			ctx.startY = translation.y.value
			position.value = Position.origin
		},
		onActive: (event, ctx) => {
			translation.x.value = ctx.startX + event.translationX

			let offsetY = 0
			if (event.translationY > 0) {
				offsetY = ctx.startY + (event.translationY > 30 ? 30 : event.translationY)
			}
			translation.y.value = offsetY
			position.value = Position.mid
		},
		onEnd: (event, ctx) => {
			let endPositionX = 0

			if (Math.abs(event.translationX) < width/4.0) {
				translation.x.value = withTiming(0)
				translation.y.value = withTiming(10)

				position.value = Position.origin
				return
			}

			if (translation.x.value < 0) {
				endPositionX = -MaxEdgePositionX
			}else {
				endPositionX = MaxEdgePositionX
			}

			position.value = Position.mid
			translation.y.value = withTiming(0)
			translation.x.value = withSpring(endPositionX, springConfig, () => {
				position.value = Position.edge
				// runOnJS(updateFrontImageIndex)()
				translation.x.value = withTiming(0, {
					duration: 100,
				}, () => {
					position.value = Position.origin
					moveStep.value = moveStep.value + 1
					// runOnJS(handelUpdateBgImageIndex)()
					runOnJS(gestureCompleteHandler)()
				})
			})
		}
	})

	const frontImageContainerStyle = useAnimatedStyle(() => {
		const rotateZ = interpolate(translation.x.value, [-width/2.0, width/2.0], [15, -15], 'clamp') + 'deg'
		let opacity = 0.0
		let positionVal = position.value
		if (positionVal === Position.origin) {
			opacity = 1.0
		} else if (positionVal === Position.mid) {
			opacity = interpolate(Math.abs(translation.x.value), [0, width/2.0], [1, 0.3], 'clamp')
		}else if (positionVal === Position.edge) { //回到origin过程中， 需要变成最后一张大小。
			opacity = 0.0
		}

		return {
			position: 'absolute',
			borderRadius: 8,
			opacity: opacity,
			transform: [
				{translateX: translation.x.value,},
				{translateY: translation.y.value},
				{rotateZ: rotateZ}
			]}
	})

	const frontImageStyle = useAnimatedStyle(() => {
		return {
			borderRadius: 8,
			width: CardSize.width,
			height: CardSize.height
		}
	})

	const secondImageContainerStyle = useAnimatedStyle(() => {
		const translationX = Math.abs(translation.x.value)
		const positionVal = position.value

		let translationY = 0
		if (positionVal === Position.mid) {
			translationY = interpolate(translationX, [0, MaxEdgePositionX], [0, 20], 'clamp')
		}else if (positionVal === Position.edge) {
			translationY = 20
		}

		const scale = positionVal !== Position.edge ? interpolate(translationX, [0, MaxEdgePositionX], [0.9, 1.0], 'clamp') : 1.0

		return {
			left: CardSize.width*(1 - scale)/2.0,
			width: CardSize.width*scale,
			height: CardSize.height*scale,
			transform: [
				{translateY: translationY},
			]
		}
	})

	const secondImageStyle = useAnimatedStyle(() => {
		const translationX = Math.abs(translation.x.value)
		const positionVal = position.value

		const scale = positionVal !== Position.edge ? interpolate(translationX, [0, MaxEdgePositionX], [0.9, 1.0], 'clamp') : 1.0

		return {
			borderRadius: 8,
			width: CardSize.width*scale,
			height: CardSize.height*scale,
		}
	})

	const handlerStageChanged = ({nativeEvent}) => {
		gestureState.value = nativeEvent.state
	}

	const {imageSource, style} = props

	useEffect(() => {
		console.log(style)
	})
	return (
		<View>
			<PanGestureHandler onHandlerStateChange={handlerStageChanged} onGestureEvent={gestureHandler}>
				<Animated.View style={[{
					}, style, frontImageContainerStyle]}>
					<Animated.Image source={imageSource} style={frontImageStyle} />
				</Animated.View>
			</PanGestureHandler>
		</View>
	)
})


export default Card
