import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {Colors} from '../../utils/styles';

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
	containerView: {
		flex: 1,
		backgroundColor: Colors.white,
		justifyContent: 'flex-end',

	},
	panelView: {
		flex: 1,
		backgroundColor: Colors.white,
		shadowRadius: 4,
		shadowColor: Colors.lightGray,
		shadowOpacity: 0.2,
		shadowOffset: {width: 0, height: 0},
		elevation: 2,
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
	}
})

const PanelView = (props) => {
	const {bottomSnapPointY, topSnapPointY} = props
	const translation = {
		y: useSharedValue(bottomSnapPointY)
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
			const edgePositionY = bottomSnapPointY - (bottomSnapPointY - topSnapPointY)/4.0
			let endPosition = bottomSnapPointY
			if (positionY < edgePositionY) {
				endPosition = topSnapPointY
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
		//
	}

	const {panelViewStyle, containerViewStyle, children} = props
	return(
		<View style={[styles.containerView, containerViewStyle]}>
			<PanGestureHandler onHandlerStateChange={handlerStageChanged} onGestureEvent={gestureHandler}>
				<Animated.View style={[styles.panelView, panelViewStyle, style]}>
					{children}
				</Animated.View>
			</PanGestureHandler>

		</View>
	)
}

PanelView.defaultProps = {
	bottomSnapPointY: (height - 88)*0.7,
	topSnapPointY: ((height - 88))*0.25,
	panelViewStyle: {},
	containerViewStyle: {},
	children: null
}

export default PanelView
