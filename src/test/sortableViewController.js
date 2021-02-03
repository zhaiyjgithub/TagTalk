import React from 'react';
import {TouchableOpacity, SafeAreaView, View, Text} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import SortableItem from './SortableItem';

const sortableViewController = () => {
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
			<View contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
				{list.map((_item, idx) => {
					const {id, bgColor} = _item
					return (
						<SortableItem key={idx}
									  bgColor={bgColor}
									  orderId={id}
									  positions={positions}
									  numberOfColumn={4}
									  renderItem={() => {
									  	return renderItem(_item)
									  }}
						/>
					)
				})}
			</View>
		</SafeAreaView>
	)
}

export default sortableViewController
