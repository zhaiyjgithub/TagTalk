import React, {Component} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	FlatList,
	View,
	Text,
	RefreshControl,
} from 'react-native';


export default class ChatViewController extends Component {
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			isRefreshing: false
		}

		this.onEndReachedCalledDuringMomentum = false
		this.number = 0
	}

	componentDidMount() {
		this.refresh()
	}

	refreshToLoadMore() {
		this.onEndReachedCalledDuringMomentum = false
		const {dataSource} = this.state
		let source = [this.number + 5, this.number + 4, this.number + 3, this.number + 2, this.number + 1]
		this.number = this.number + 6

		setTimeout(() => {
			this.setState({dataSource: dataSource.concat(source.reverse())})
		}, 2000)
	}

	refresh() {
		const {dataSource} = this.state
		let source = [this.number + 5, this.number + 4, this.number + 3, this.number + 2, this.number + 1]
		this.number = this.number + 6

		this.setState({isRefreshing: true})

		setTimeout(() => {
			this.setState({isRefreshing:false, dataSource: dataSource.concat(source.reverse())})
		}, 2000)
	}

	renderItem(item) {
		return (
			<View style={{flex: 1, height: 80}}>
				<Text>{item}</Text>
			</View>
		)
	}

	render(){
		const {dataSource} = this.state

		return (
			<View style={{flex: 1}}>
				<FlatList
					ref={(o) => {
						this._flatList = o
					}}
					style={{flex: 1}}
					data={dataSource}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					inverted={true}
					onEndReachedThreshold={0.5}
					onEndReached = {() => {
						if (!this.onEndReachedCalledDuringMomentum) {
							this.refreshToLoadMore()
							this.onEndReachedCalledDuringMomentum = true;
						}
					}}
					onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
				/>
			</View>
		)
	}
}
