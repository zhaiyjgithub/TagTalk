import React, {memo} from 'react';
import {Dimensions, Image, View, Text} from 'react-native';
const {width, height} = Dimensions.get('window')
import Animated, {
	Easing, interpolate,
	useAnimatedGestureHandler, useAnimatedStyle,
	useSharedValue,
	withSequence,
	withSpring,
	withTiming,
	call,
	runOnUI,
	runOnJS,
} from 'react-native-reanimated';
import {Colors} from '../../../utils/styles';

const CardSize = {
	width: (width - 60),
	height: height*0.5
}

export {
	CardSize
}

const AnimationCard = memo(function AnimationCard(props) {
	const {imageSource, style, containerStyle, likeContainerStyle, nopeContainerStyle} = props

	const renderNope = () => {
		if (nopeContainerStyle.opacity < 0.2) {
			return null
		}

		return (
			<Animated.View style={[{position: 'absolute', right: 0, top: 0}, nopeContainerStyle]}>
				<Text style={{fontSize: 24, color: Colors.black}}>{'NOPE'}</Text>
			</Animated.View>
		)
	}

	const renderLike = () => {
		if (likeContainerStyle.opacity < 0.2) {
			return null
		}

		return (
			<Animated.View style={[{position: 'absolute', left: 0, top: 0}, likeContainerStyle]}>
				<Text style={{fontSize: 24, color: Colors.black}}>{'NOPE'}</Text>
			</Animated.View>
		)
	}
	return (
			<Animated.View style={[{backgroundColor: Colors.white}, containerStyle]}>
				<Animated.Image source={imageSource} style={style} />
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
					marginTop: 15, paddingHorizontal: 10
				}}>
					<Text numberOfLines={1} style={{fontSize: 20, color: Colors.black, fontWeight: '500', maxWidth: '70%'}}>{'Cath, 23'}</Text>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
						<Image style={{width: 8, height: 13, backgroundColor: Colors.red, marginRight: 5}}/>
						<Text style={{fontSize: 16, color: Colors.red}}>{'99%'}</Text>
					</View>
				</View>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10,
					marginBottom: 10, marginTop: 8,
				}}>
					<Text numberOfLines={1} style={{flex:1, fontSize: 18, color: Colors.gray}}>{'Friends with Andrea'}</Text>
				</View>

				{renderNope()}
				{renderLike()}
			</Animated.View>
	)
})


export default AnimationCard
