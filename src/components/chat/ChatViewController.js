import React, {Component} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	FlatList,
	View,
	Text,
	RefreshControl,
	TouchableOpacity,
	TextInput,
	Image,
	Animated,
	Keyboard
} from 'react-native';
import ChatItem from './view/ChatItem';
import {Colors} from '../../utils/styles';
import {PLATFORM} from '../../utils/Enums';

export default class ChatViewController extends Component {
	static defaultProps = {
		uid: 0
	}

	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			isRefreshing: false,
			typingMessage: ''
		}

		this.onEndReachedCalledDuringMomentum = false
		this.number = 0
		this.inputViewMarginBottom = new Animated.Value(0)
		this.textMessage = ''
	}

	componentDidMount() {
		this.addKeyboardListener()
		// this.refresh()
	}

	componentWillUnmount(): void {
		this.keyboardWillShowSub && this.keyboardWillShowSub.remove()
		this.keyboardWillHideSub && this.keyboardWillHideSub.remove()
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
			this.setState({isRefreshing: false, dataSource: dataSource.concat(source.reverse())})
		}, 2000)
	}

	addKeyboardListener() {
		if (PLATFORM.isIOS) {
			this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
			this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
		}else {
			this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this));
			this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this));
		}
	}

	keyboardWillShow(event) {
		this.keyboardDuration = event.duration
		if (PLATFORM.isIOS) {
			let safeAreaViewHeight = PLATFORM.isX ? 34 : 0
			Animated.timing(this.inputViewMarginBottom,{duration:this.keyboardDuration,toValue:event.endCoordinates.height - safeAreaViewHeight, useNativeDriver: false}).start()
		}else {
			Animated.timing(this.inputViewMarginBottom,{duration:this.keyboardDuration,toValue:event.endCoordinates.height, useNativeDriver: false}).start()
		}
	}

	keyboardWillHide(event) {
		if (PLATFORM.isIOS) {
			Animated.timing(this.inputViewMarginBottom,{duration: this.keyboardDuration,toValue:0, useNativeDriver: false}).start()
		}else {
			Animated.timing(this.inputViewMarginBottom,{duration: this.keyboardDuration,toValue: 0, useNativeDriver: false}).start()
		}
	}

	renderInputBar() {
		const {typingMessage} = this.state
		return(
			<Animated.View  style={{width: '100%', height: 60, flexDirection: 'row',
				alignItems: 'center', justifyContent: 'space-between',
				marginBottom: this.inputViewMarginBottom,
			}}>
				<TouchableOpacity style={{width: 30, height: 30,marginHorizontal: 10,}} >
					<Image source={require('../../source/image/chat/voice.png')}/>
				</TouchableOpacity>

				<TextInput
					ref ={(o) => {
						this._textInput = o
					}}
					value = {typingMessage}
					onKeyPress={(e) => {
						let key = e.nativeEvent.key
						if (key === 'Enter') {
							if (!this.textMessage.length) {
								return
							}

							this.setState({typingMessage: ''}, () => {
								this.appendNewMessage(this.textMessage)
								this.textMessage = ''
							})
						}else {
							this.textMessage = this.textMessage + key
							this.setState({typingMessage: this.textMessage})
						}
					}}
					multiline={true}
					underlineColorAndroid={'transparent'}
					returnKeyType={'send'}
					placeholder={'Type a message...'}
					style={{flex: 1, backgroundColor: '#efeff4', height: 36,
					borderRadius: 4, fontSize: 16, paddingHorizontal: 4,
				}}/>

				<TouchableOpacity style={{width: 30, height: 30, marginHorizontal: 10,}} >
					<Image source={require('../../source/image/chat/add.png')}/>
				</TouchableOpacity>

				<View style={{width: '100%', height: 1, backgroundColor: Colors.lineColor,
					position: 'absolute', left: 0, top: 0,
				}}/>
			</Animated.View>
		)
	}

	insert(arr, index, ...newItems){
		return [
			// part of the array before the specified index
			...arr.slice(0, index),
			// inserted items
			...newItems,
			// part of the array after the specified index
			...arr.slice(index)
		]
	}

	appendNewMessage(message) {
		const {dataSource} = this.state
		this.setState({dataSource: this.insert(dataSource, 0, [message])})
	}

	renderItem(item) {
		return (
			<ChatItem />
		)
	}

	render() {
		const {dataSource} = this.state

		return (
				<SafeAreaView style={{flex: 1,}}>
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
						onEndReached={() => {
							if (!this.onEndReachedCalledDuringMomentum) {
								// this.refreshToLoadMore()
								this.onEndReachedCalledDuringMomentum = true;
							}
						}}
						onMomentumScrollBegin={() => {
							this.onEndReachedCalledDuringMomentum = false;
						}}
					/>

					{this.renderInputBar()}
				</SafeAreaView>
		)
	}
}
