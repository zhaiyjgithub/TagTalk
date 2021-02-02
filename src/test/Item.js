import React, { useState, useEffect, } from "react"
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
	withSequence, useAnimatedReaction,
} from 'react-native-reanimated';
import {animationConfig, COL, getPosition, ItemPosition, ItemSize} from './tool';
import {PanGestureHandler, State} from 'react-native-gesture-handler'

const Item = (props) => {
	const {bgColor, orderId, positions} = props



	const isActive = useSharedValue(false)

	const calcNewPosition = (orderNumber) => {
		"worklet";
		return {
			x: orderNumber % COL === 0 ? 0 : ItemSize.width,
			y: Math.floor(orderNumber/COL)*ItemSize.height
		}
	}

	const position = calcNewPosition(positions.value[orderId])
	const translation = {
		x: useSharedValue(position.x),
		y: useSharedValue(position.y)
	}

	const calcOrder = (translationX, translationY) => {
		"worklet";
		const offsetX = Math.max(translationX, 0)
		const offsetY = Math.max(translationY, 0)
		const row = Math.round(offsetX/ItemSize.width) // over 0.5*ItemSize.height, so change to order
		const column = Math.round(offsetY/ItemSize.height)
		return (column*COL + row)
	}

	useAnimatedReaction(() => {
		return positions
	}, () => {

	})

	const gestureHandler = useAnimatedGestureHandler({
		onStart:(_, ctx) => {
			ctx.startX = translation.x.value
			ctx.startY = translation.y.value
			isActive.value = true
		},
		onActive: (event, ctx) => {
			translation.x.value = ctx.startX + event.translationX
			translation.y.value = ctx.startY + event.translationY
			//这里计算交换 order number

			const oldOrder = positions.value[orderId]
			const newOrder = calcOrder(translation.x.value, translation.y.value)
			console.log('newOrder: ', newOrder)
			// positions.value[orderId] = newOrder
			console.log("before: " + positions.value[orderId])

			let newPositions = JSON.parse(JSON.stringify(positions.value))
			newPositions[orderId] = newOrder
			positions.value = newPositions
			console.log("after: " + positions.value[orderId])
			// console.log(positions.value)
			// positions.value['blue'] = 0
		},
		onEnd: (event, ctx) => {
			let position = calcNewPosition(positions.value[orderId])
			translation.x.value = withTiming(position.x, animationConfig, () => {
				isActive.value = false
			})
			translation.y.value = withTiming(position.y, animationConfig)
		}
	})

	const style = useAnimatedStyle(() => {
		const zIndex = isActive.value ? 101 : 100

		return {
			position: 'absolute',
			left: 0,
			top: 0,
			zIndex: zIndex,
			transform: [
				{translateX: translation.x.value},
				{translateY: translation.y.value}
			]
		}
	})

	return (
		<Animated.View style={style}>
			<PanGestureHandler onGestureEvent={gestureHandler}>
				<Animated.View get style={[{width: ItemSize.width, height: ItemSize.height, borderRadius: 10,
					backgroundColor: bgColor
				}]}>

				</Animated.View>
			</PanGestureHandler>
		</Animated.View>

	)
}

export default Item
