import React from 'react';
import Animated, {
	Easing,
	useAnimatedGestureHandler,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {ScreenDimensions} from '../utils/Dimemsions';

const animationConfig = {
	easing: Easing.inOut(Easing.ease),
	duration: 250,
}

const SortableItem = (props) => {
	const {bgColor, orderId,
		positions, renderItem,
		numberOfColumn
	} = props
	const itemHeight = ScreenDimensions.width/numberOfColumn
	const itemWidth = ScreenDimensions.width/numberOfColumn

	const isActive = useSharedValue(false)
	const dataSourceLength = Object.keys(positions.value).length

	const calcNewPosition = (orderNumber) => {
		"worklet";
		return {
			x: (orderNumber % numberOfColumn)*itemWidth,
			y: Math.floor(orderNumber/numberOfColumn)*itemHeight
		}
	}

	const position = calcNewPosition(positions.value[orderId])
	const translation = {
		x: useSharedValue(position.x),
		y: useSharedValue(position.y)
	}

	const calcOrder = (translationX, translationY) => {
		"worklet";
		const maxHeight = Math.floor((dataSourceLength - 1)/numberOfColumn)*itemHeight
		const offsetX = Math.max(translationX, 0)
		const offsetY = Math.max(translationY, 0)
		const maxOffsetY = Math.min(maxHeight, offsetY)

		const row = Math.round(offsetX/itemWidth) // over 0.5*ItemSize.height, so change to order
		const column = Math.round(maxOffsetY/itemHeight)

		return Math.min((column*numberOfColumn + row), (dataSourceLength - 1))
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
				<Animated.View get style={[{width: itemWidth, height: itemHeight,
					backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center'
				}]}>
					{renderItem && renderItem()}
				</Animated.View>
			</PanGestureHandler>
		</Animated.View>

	)
}

export default SortableItem
