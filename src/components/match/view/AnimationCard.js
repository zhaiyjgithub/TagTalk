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
	height: height*0.55
}

export {
	CardSize
}

const AnimationCard = memo(function AnimationCard(props) {
	const {imageSource, style, containerStyle, likeContainerStyle, nopeContainerStyle, starLikeContainerStyle} = props

	const renderNope = () => {
		if (nopeContainerStyle.opacity < 0.2) {
			return null
		}

		return (
			<Animated.View style={[{position: 'absolute', right: 20, top: 40,
				borderWidth: 6, borderColor: Colors.nopeRed, paddingHorizontal: 5,
				paddingVertical: 5,  transform: [{rotateZ: '-15deg'}]
			}, nopeContainerStyle]}>
				<Text style={{fontSize: 48, color: Colors.nopeRed, fontWeight: 'bold',}}>{'NOPE'}</Text>
			</Animated.View>
		)
	}

	const renderLike = () => {
		if (likeContainerStyle.opacity < 0.2) {
			return null
		}

		return (
			<Animated.View style={[{position: 'absolute', left: 20, top: 40,
				borderWidth: 6, borderColor: Colors.likeGreen, paddingHorizontal: 5,
				paddingVertical: 5, transform: [{rotateZ: '15deg'}]
			}, likeContainerStyle]}>
				<Text style={{fontSize: 48, color: Colors.likeGreen, fontWeight: 'bold',}}>{'LIKE'}</Text>
			</Animated.View>
		)
	}

	const renderStarLike = () => {
		if (starLikeContainerStyle.opacity < 0.2) {
			return null
		}

		return (
			<Animated.View style={[{position: 'absolute', left: (CardSize.width - 190)/2.0, top: (CardSize.height - 100)/2.0,
				borderWidth: 6, borderColor: Colors.starLikeBlue, paddingHorizontal: 5,
				paddingVertical: 5,
			}, starLikeContainerStyle]}>
				<Text style={{fontSize: 48, color: Colors.starLikeBlue, fontWeight: 'bold', textAlign: 'center', width: 180}}>{'SUPER\nLIKE'}</Text>
			</Animated.View>
		)
	}
	return (
			<Animated.View style={[{backgroundColor: Colors.white}, containerStyle]}>
				<Animated.Image source={imageSource} style={style} />
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
					marginTop: 15, paddingHorizontal: 10
				}}>
					<View style={{flexDirection: 'row', alignItems: 'center', maxWidth: '70%'}}>
						<Text numberOfLines={1} style={{fontSize: 20, color: Colors.black, fontWeight: '500', }}>{'Cath, 23'}</Text>
						<Image source={require('../../../source/image/match/female.png')} style={{width: 20, height: 20, marginLeft: 15,
							tintColor: Colors.female
						}}/>
					</View>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
						<Image source={require('../../../source/image/match/intersection.png')} style={{width: 15, height: 15,marginRight: 5,
							tintColor: Colors.black
						}}/>
						<Text style={{fontSize: 16, color: Colors.black, fontWeight: '500'}}>{'99%'}</Text>
					</View>
				</View>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10,
					marginBottom: 10, marginTop: 8,
				}}>
					<Text numberOfLines={1} style={{flex:1, fontSize: 18, color: Colors.gray}}>{'Friends with Andrea'}</Text>
				</View>

				{renderNope()}
				{renderLike()}
				{renderStarLike()}
			</Animated.View>
	)
})


export default AnimationCard
