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
	const dataSourceLength = Object.keys(positions.value).length

	const calcNewPosition = (orderNumber) => {
		"worklet";
		return {
			x: (orderNumber % COL)*ItemSize.width,
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
		const maxHeight = Math.floor((dataSourceLength - 1)/COL)*ItemSize.height
		const offsetX = Math.max(translationX, 0)
		const offsetY = Math.max(translationY, 0)
		const maxOffsetY = Math.min(maxHeight, offsetY)

		const row = Math.round(offsetX/ItemSize.width) // over 0.5*ItemSize.height, so change to order
		const column = Math.round(maxOffsetY/ItemSize.height)

		return (column*COL + row)
	}

	const moveForward = (newPositions, fromOrder, toOrder, fromId) => {
		"worklet";
		if (fromOrder === toOrder) {
			return position
		}
		Object.keys(newPositions).map((key, index) => {
			let curNumber = newPositions[key]
			if (curNumber > fromOrder && curNumber <= toOrder) {
				newPositions[key] = curNumber - 1
			}
		})
		newPositions[fromId] = toOrder

		return newPositions
	}

	const moveBack = (newPositions, fromOrder, toOrder, fromId) => {
		"worklet";
		if (fromOrder === toOrder) {
			return position
		}
		Object.keys(newPositions).map((key, index) => {
			let curNumber = newPositions[key]
			if (curNumber >= toOrder && curNumber < fromOrder) {
				newPositions[key] = curNumber + 1
			}
		})
		newPositions[fromId] = toOrder

		return newPositions
	}

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
			let newPositions = JSON.parse(JSON.stringify(positions.value))
			if (oldOrder > newOrder) {
				positions.value = moveBack(newPositions, oldOrder, newOrder, orderId)
			}else if (oldOrder < newOrder) {
				positions.value = moveForward(newPositions, oldOrder, newOrder, orderId)
			}else {
				positions.value = newPositions
			}
		},
		onEnd: (event, ctx) => {
			let position = calcNewPosition(positions.value[orderId])
			translation.x.value = withTiming(position.x, animationConfig, () => {
				isActive.value = false
			})
			translation.y.value = withTiming(position.y, animationConfig)
		}
	})

	useAnimatedReaction(() => {
		return positions.value[orderId]
	}, (orderNumber) => {
		if (!isActive.value) {
			const pos = calcNewPosition(orderNumber)
			translation.x.value = withTiming(pos.x, animationConfig)
			translation.y.value = withTiming(pos.y, animationConfig)
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
					backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center'
				}]}>
					{/*<Text style={{fontSize: 30, color: '#fff', fontWeight: 'bold'}}>{positions.value[orderId]}</Text>*/}
				</Animated.View>
			</PanGestureHandler>
		</Animated.View>

	)
}

export default Item
