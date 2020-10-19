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
import {MessageType, PLATFORM} from '../../utils/Enums';
import {Message} from './model/Message'
import ImagePicker from 'react-native-image-crop-picker';

export default class ChatViewController extends Component {
	static defaultProps = {
		uid: 0
	}

	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			isRefreshing: false,
			textMessage: '',
			isShowMediaPanel: false
		}

		this.onEndReachedCalledDuringMomentum = false
		this.number = 0
		this.inputViewMarginBottom = new Animated.Value(0)
	}

	componentDidMount() {
		this.addKeyboardListener()
		// this.refresh()
	}

	componentWillUnmount(): void {
		this.keyboardWillShowSub && this.keyboardWillShowSub.remove()
		this.keyboardWillHideSub && this.keyboardWillHideSub.remove()
	}

	getUser() {
		return {
			id: 1,
		}
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
		const {textMessage, isShowMediaPanel} = this.state
		return(
			<Animated.View  style={{width: '100%', height: 60, flexDirection: 'row',
				alignItems: 'center', justifyContent: 'space-between',
				marginBottom: this.inputViewMarginBottom,
			}}>
				<TouchableOpacity onPress={() => {
					Keyboard.dismiss()
					this.setState({isShowMediaPanel: !isShowMediaPanel})
				}} style={{width: 30, height: 30,marginHorizontal: 10,}} >
					<Image source={require('../../source/image/chat/add.png')}/>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => {
					Keyboard.dismiss()
					this.setState({isShowMediaPanel: false})
				}} style={{width: 30, height: 30, marginRight: 10,}} >
					<Image source={require('../../source/image/chat/voice.png')}/>
				</TouchableOpacity>

				<TextInput
					onChangeText={(text) => {
						this.setState({textMessage: text})
					}}
					onFocus={() => {
						this.setState({isShowMediaPanel: false})
					}}
					value={textMessage}
					multiline={true}
					underlineColorAndroid={'transparent'}
					returnKeyType={'send'}
					placeholder={'Type a message...'}
					style={{flex: 1, backgroundColor: '#efeff4', height: 36,
					borderRadius: 4, fontSize: 16, paddingHorizontal: 4,
				}}/>

				<TouchableOpacity onPress={() => {
					if (!(textMessage + '').length ) {
						return
					}

					this.appendNewTextMessage(textMessage)
				}} style={{width: 30, height: 30, marginHorizontal: 10,}} >
					<Image style={{alignItems: 'center'}} source={require('../../source/image/chat/send.png')}/>
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

	getDateTimeISO() {
		return (new Date()).toISOString()
	}

	appendNewTextMessage(text) {
		let message = new Message()
		message.type = MessageType.Text
		message.user = this.getUser()
		message.text = text
		message.createdAt = this.getDateTimeISO()
		message.updatedAt = message.createdAt

		this.appendNewMessage(message)
	}

	appendNewMessage(message) {
		const {dataSource, textMessage} = this.state
		this.setState({dataSource: this.insert(dataSource, 0, message),
			textMessage: ''
		})
	}

	renderMediaPanel() {
		const {isShowMediaPanel} = this.state
		if (!isShowMediaPanel) {
			return
		}

		return(
			<View style={{width: '100%', height: 120, backgroundColor: Colors.white}}>
				<View style={{width: '100%', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row'}}>{this.renderMediaItem()}</View>

				<View style={{width: '100%', height: 1, backgroundColor: Colors.lineColor,
					position: 'absolute', left: 0, top: 0,
				}}/>
			</View>
		)
	}

	renderMediaItem() {
		let arr = [
			{source: require('../../source/image/chat/image.png'),
			type: MediaButtonType.photo, title: 'Photo',},
			{source: require('../../source/image/chat/camera.png'),
				type: MediaButtonType.camera, title: 'Camera',},
			{source: require('../../source/image/chat/location.png'),
				type: MediaButtonType.location, title: 'Location',},
		]

		let size = 55

		return arr.map((item, key) => {
			return (
				<View key={key} style={{alignItems: 'center', marginTop: 10}}>
					<TouchableOpacity onPress={() => {
						this.openMedia(item.type)
					}} style={{width: size, height: size, backgroundColor: Colors.lineGray, borderRadius: 8,
						alignItems: 'center', justifyContent: 'center'
					}}>
						<Image style={{alignSelf: 'center'}} source={item.source}/>
					</TouchableOpacity>
					<Text style={{fontSize: 14, color: Colors.black, marginTop: 8,}}>{item.title}</Text>
				</View>
			)
		})
	}

	openMedia(type) {
		switch (type) {
			case MediaButtonType.photo:
				this.openPhotoLibrary()
				break
			case MediaButtonType.camera:
				this.openPhotoLibrary()
				break
			default: ;
		}
	}

	openPhotoLibrary() {
		ImagePicker.openPicker({
			multiple: true
		}).then(images => {
			console.log(images);

			if (images && images.length) {
				images.map((item) => {
					this.appendNewImageMessage(MessageType.Image, item.path)
				})
			}
		});
	}

	openCamera() {
		ImagePicker.openCamera({
			width: 300,
			height: 400,
			cropping: true,
		}).then(image => {
			console.log(image);
		});
	}

	appendNewImageMessage(type, url) {
		let message = new Message()
		message.type = type
		message.user = this.getUser()
		message.imageURL = url
		message.createdAt = this.getDateTimeISO()
		message.updatedAt = message.createdAt

		this.appendNewMessage(message)
	}

	renderItem(message) {
		return (
			<ChatItem
				message = {message}
				isPeer = {message.user.id !== this.getUser().id}
				previewImageAction={(url) => {
					this.previewImage(url)
				}}
			/>
		)
	}

	previewImage(url) {
		ImagePicker.openCropper({
			path: url,
			width: 300,
			height: 400,
			cropperChooseText: '',
			hideBottomControls: true
		}).then(image => {
			//
		}).catch(() => {

		})
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
					{this.renderMediaPanel()}
				</SafeAreaView>
		)
	}
}

const MediaButtonType = {
	photo: 0,
	camera: 1,
	location: 2,

}
