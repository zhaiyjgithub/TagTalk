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
	const {imageSource, style} = props
	return (
		<View style={{backgroundColor: Colors.white, borderRadius: 8}}>
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

			{/*<Animated.View>*/}
			{/*	<Text style={{fontSize: 36, }}>{'NOPE'}</Text>*/}
			{/*</Animated.View>*/}
		</View>
	)
})


export default AnimationCard
