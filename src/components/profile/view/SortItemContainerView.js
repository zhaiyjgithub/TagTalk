import React, {memo} from 'react';
import {Dimensions, Image, View, Text, TouchableOpacity} from 'react-native';
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
import {ScreenDimensions} from '../../../utils/Dimemsions';
import SortableItem from '../../../test/SortableItem';
import FastImage from 'react-native-fast-image';

export const ImageActionType = {
	default: 0,
	normal: 1
}

const SortItemContainerView = (props) => {
	const convertDataSourceToShardedValue = () => {
		let len = 8
		let value = []
		for (let i = 0; i < len; i ++) {
			value[i.toString()] = i
		}

		return value
	}
	const positions = useSharedValue(convertDataSourceToShardedValue());
	const {dataSource, handleRemoveImage, openMultiPhotoLibrary} = props

	const renderRemoveImageButton = (item) => {
		return(
			<TouchableOpacity onPress={() => {
				handleRemoveImage && handleRemoveImage(item)
			}} style={{width: 30, height: 30, justifyContent: 'center',
				alignItems: 'center',
				position: 'absolute', right: 0, top: 0
			}}>
				<View style={{width: 20, height: 20, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 10, }}>
					<Image style={{tintColor: Colors.white,
						width: 20, height: 20,
					}} source={require('../../../source/image/match/reduce-one.png')}/>
				</View>
			</TouchableOpacity>
		)
	}


	const renderImage = (uri) => {
		const size = (ScreenDimensions.width/4)
		if (uri && uri.startsWith("http")) {
			return (
				<FastImage
					style={{ width: size, height: size, }}
					source={{
						uri:  uri,
						priority: FastImage.priority.normal,
					}}
					resizeMode={FastImage.resizeMode.cover}
				/>
			)
		}else {
			return <Image source={{uri: uri}} style={{width: size, height: size}}/>}
	}

	const renderItem = (item) => {
		const {id, uri, type} = item
		const size = (ScreenDimensions.width/4)
		return (
			<TouchableOpacity onPress={() => {
				if (type === ImageActionType.default) {
					openMultiPhotoLibrary && openMultiPhotoLibrary()
				}else {
					//
				}
			}} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.systemGray,
				width: size, height: size
			}}>
				{type === ImageActionType.default ? <Image source={uri} style={{width: 50, height: 50, tintColor: Colors.black}}/> :
					renderImage(uri)}

				{type === ImageActionType.default ? null : renderRemoveImageButton(item)}
			</TouchableOpacity>
		)
	}

	return (
		<View style={{flexDirection: 'row', flexWrap: 'wrap', height: (ScreenDimensions.width/4)*2, marginTop: 5}}>
			{dataSource.map((_item, idx) => {
				const {id, uri, type} = _item
				return (
					<SortableItem key={idx}
								  orderId={id}
								  isEnablePanGesture={type !== ImageActionType.default}
								  uri={uri}
								  maxLen={dataSource.length - 1}
								  positions={positions}
								  numberOfColumn={4}
								  renderItem={() => {
									  return renderItem(_item)
								  }}
					/>
				)
			})}
		</View>
	)
}

export default SortItemContainerView
