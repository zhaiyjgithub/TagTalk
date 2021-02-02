import React, { useState, useEffect, } from "react"
import {SafeAreaView, Button, View, Text, Dimensions, ScrollView} from 'react-native'
import {Colors} from '../utils/styles';
import Animated,  {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
	useAnimatedGestureHandler,
	withSpring,
	interpolate,
	concat,
	withSequence
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler'
import Item from './Item';
import {ItemPosition} from './tool';
const {width} = Dimensions.get('window')


const sortableViewController = () => {
	// const positions = useSharedValue({})

	let list = [
		{bgColor: 'red', id: 'red'},
		{bgColor: 'blue', id: 'blue'},
		{bgColor: 'yellow', id: 'yellow'},
		{bgColor: 'black', id: 'black'},
		{bgColor: 'gray', id: 'gray'},
		{bgColor: 'green', id: 'green'}
	]

	const dataSourceToShardedValue = (dataSource) => {
		let obj = {}
		dataSource.forEach((_item, idx,) => {
			const {id} = _item
			obj[id] = idx
		})

		return obj
	}
	const positions = useSharedValue(dataSourceToShardedValue(list));

	useEffect(() => {
		console.log(positions)
	})

	return(
		<View style={{flex: 1,}}>
			<ScrollView contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
				{list.map((_item, idx) => {
					const {id, bgColor} = _item
					return (
						<Item key={idx} bgColor={bgColor} orderId={id} positions={positions}/>
					)
				})}
			</ScrollView>
		</View>
	)
}

export default sortableViewController
