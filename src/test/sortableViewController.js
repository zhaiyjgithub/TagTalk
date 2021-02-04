import React, {useEffect} from 'react';
import {TouchableOpacity, SafeAreaView, View, Text} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import SortableItem from './SortableItem';

const sortableViewController = () => {
	let list = [
		{id: '0'},
	]

	const convertDataSourceToShardedValue = (dataSource) => {
		let obj = {}
		dataSource.forEach((_item, idx,) => {
			const {id} = _item
			obj[id] = idx
		})

		return obj
	}
	const positions = useSharedValue(convertDataSourceToShardedValue(list));

	const renderItem = (item) => {
		const {id} = item
		return (
			<TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text style={{fontSize: 30, color: '#fff'}}>{id}</Text>
			</TouchableOpacity>
		)
	}

	return(
		<SafeAreaView style={{flex: 1,}}>
			<TouchableOpacity onPress={() => {
				console.log('position: ', JSON.stringify(positions.value))
				positions.value = {1: 1}

				setTimeout(() => {
					console.log('position: ', JSON.stringify(positions.value))
				}, 1000)
			}}>
				<Text>{'Click'}</Text>
			</TouchableOpacity>
			{/*<View contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>*/}
			{/*	{list.map((_item, idx) => {*/}
			{/*		const {id, bgColor} = _item*/}
			{/*		return (*/}
			{/*			<SortableItem key={idx}*/}
			{/*						  bgColor={bgColor}*/}
			{/*						  orderId={id}*/}
			{/*						  positions={positions}*/}
			{/*						  numberOfColumn={4}*/}
			{/*						  renderItem={() => {*/}
			{/*						  	return renderItem(_item)*/}
			{/*						  }}*/}
			{/*			/>*/}
			{/*		)*/}
			{/*	})}*/}
			{/*</View>*/}
		</SafeAreaView>
	)
}

export default sortableViewController
