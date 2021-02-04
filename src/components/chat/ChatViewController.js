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
	Keyboard,
	TouchableWithoutFeedback, PermissionsAndroid, DeviceEventEmitter,
} from 'react-native';
import ChatItem from './view/ChatItem';
import {Colors} from '../../utils/styles';
import {ChannelType, EventName, MessageCategory, MessageMediaType, PLATFORM} from '../../utils/Enums';
import {Message} from './model/Message'
import ImagePicker from 'react-native-image-crop-picker';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../utils/Navigator';
import { Player, Recorder, MediaStates } from '@react-native-community/audio-toolkit';
import RNFS from 'react-native-fs'
import ChatService from './service/ChatService';

export default class ChatViewController extends Component {
	static defaultProps = {
		friendInfo: {}
	}

	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			isRefreshing: false,
			textMessage: '',
			isShowMediaPanel: false,
			isVoicing: false
		}

		this.onEndReachedCalledDuringMomentum = false
		this.number = 0
		this.inputViewMarginBottom = new Animated.Value(0)

		this.recorder = null;
		this.chatService = new ChatService()

		this.addKeyboardListener()
		this.addEventListener()
	}

	componentDidMount() {

		// this.refresh()
	}

	componentWillUnmount() {
		this.removeKeyboardListener()
		this.removeEventListener()
	}

	getUserInfo() {
		return global.UserInfo
	}

	getFriendInfo() {
		const {friendInfo} = this.props
		return friendInfo
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
			this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
			this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
		}else {
			this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
			this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
		}
	}

	removeKeyboardListener() {
		this.keyboardWillShowSub && this.keyboardWillShowSub.remove()
		this.keyboardWillHideSub && this.keyboardWillHideSub.remove()
	}

	keyboardWillShow = (event) => {
		this.keyboardDuration = event.duration
		if (PLATFORM.isIOS) {
			let safeAreaViewHeight = PLATFORM.isX ? 34 : 0
			Animated.timing(this.inputViewMarginBottom,{duration:this.keyboardDuration,toValue:event.endCoordinates.height - safeAreaViewHeight, useNativeDriver: false}).start()
		}else {
			Animated.timing(this.inputViewMarginBottom,{duration:this.keyboardDuration,toValue:event.endCoordinates.height, useNativeDriver: false}).start()
		}
	}

	keyboardWillHide = (event) => {
		if (PLATFORM.isIOS) {
			Animated.timing(this.inputViewMarginBottom,{duration: this.keyboardDuration,toValue:0, useNativeDriver: false}).start()
		}else {
			Animated.timing(this.inputViewMarginBottom,{duration: this.keyboardDuration,toValue: 0, useNativeDriver: false}).start()
		}
	}

	addEventListener() {
		this.onMessageReceiverListener = DeviceEventEmitter.addListener(EventName.websocket.onmessage, (e) => {
			if (e && e.data) {
				let message = JSON.parse(e.data)
				if (message.category !== MessageCategory.normal) {
					return
				}

				this.appendNewMessage(message)
			}
		})
	}

	removeEventListener() {
		this.onMessageReceiverListener && this.onMessageReceiverListener.remove()
	}

	renderVoiceButton() {
		return (
			<View activeOpacity={0.6} style={{flex: 1, backgroundColor: '#efeff4', height: 36,
				borderRadius: 4, fontSize: 16, paddingHorizontal: 4,
				justifyContent: 'center', alignItems: 'center'
			}}>
				<TouchableWithoutFeedback onPress={() => {
					console.log('onPress')
				}} onLongPress={() => {
					console.log('on long press')
					this.toggleRecord()
				}} onPressIn={() => {
					console.log('on press in ')
				}} onPressOut={() => {
					this.recorderStop()
					console.log('on press out')
				}}>
					<Text style={{fontSize: 16, color: Colors.black, fontWeight: 'bold'}}>{'Press and speak'}</Text>
				</TouchableWithoutFeedback>
			</View>

		)
	}

	getFileName () {
		return (new Date()).getTime() + '-' + 'voice.mp4'
	}

	updatePlayerState() {

	}

	playerPlay() {
		if (!this.filePath || !this.filePath.length) {
			console.log('audio file path error')
			return
		}

		this.playerInit(this.filePath)
		this.player && this.player.play((error) => {
			console.log('error : ' + JSON.stringify(error))
		})
	}

	playerPause() {
		this.player && this.player.playPause((err, paused) => {
			if (err) {
				this.setState({
					error: err.message
				});
			}
		});
	}

	playerStop() {
		this.player.stop(() => {
			//
		});
	}

	playerInit(filePath) {
		if (this.player) {
			this.player.destroy();
		}

		this.player = new Player(filePath)
	}

	recorderInit(fileName) {
		if (this.recorder) {
			this.recorder.destroy();
		}

		this.recorder = new Recorder(fileName, {
			bitrate: 256000,
			channels: 2,
			sampleRate: 44100,
			quality: 'max'
		});
	}

	toggleRecord() {
		if (this.player) {
			this.player.destroy();
		}

		let recordAudioRequest;
		if (PLATFORM.isAndroid) {
			recordAudioRequest = this.requestRecordAudioPermission();
		} else {
			recordAudioRequest = new Promise(function (resolve, reject) { resolve(true); });
		}

		recordAudioRequest.then((hasPermission) => {
			if (!hasPermission) {
				this.setState({
					error: 'Record Audio Permission was denied'
				});
				return;
			}

			let fileName = this.getFileName()
			this.filePath = 'file://' + RNFS.DocumentDirectoryPath+ '/'  + fileName
			this.recorderInit(fileName)
			this.recorder.toggleRecord((err, stopped) => {
				console.log("toggleRecord response: " + err + stopped)
				if (err) {
					this.setState({
						error: err.message
					});
				}
				if (stopped) {
					//
				}

			});
		});
	}

	recorderStop() {
		this.recorder && this.recorder.stop((error) => {
			console.log("stop record error:" + error)
		})
	}

	async requestRecordAudioPermission() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
				{
					title: 'Microphone Permission',
					message: 'ExampleApp needs access to your microphone to test react-native-audio-toolkit.',
					buttonNeutral: 'Ask Me Later',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				},
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	toggleLooping(value) {
		this.setState({
			loopButtonStatus: value
		});
		if (this.player) {
			this.player.looping = value;
		}
	}

	renderTextInput() {
		const {textMessage} = this.state
		return (
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
				placeholder={'Type a message...'}
				style={{flex: 1, backgroundColor: '#efeff4', height: 36,
					borderRadius: 4, fontSize: 16, paddingHorizontal: 4,
				}}/>
		)
	}

	renderInputBar() {
		const {textMessage, isShowMediaPanel, isVoicing} = this.state
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
					this.setState({isShowMediaPanel: false, isVoicing: !isVoicing})
				}} style={{width: 30, height: 30, marginRight: 10,}} >
					<Image source={require('../../source/image/chat/voice.png')}/>
				</TouchableOpacity>

				{isVoicing ? this.renderVoiceButton() : this.renderTextInput()}

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

		const {Name} = this.getUserInfo()
		message.nickName = Name
		message.mediaType = MessageMediaType.text
		message.senderId = this.getUserInfo().ChatID
		message.message = text
		message.channelType = ChannelType.single
		message.channelId = this.getFriendInfo().ChatID
		message.createdAt = this.getDateTimeISO()
		message.updatedAt = message.createdAt
		this.appendNewMessage(message)

		this.chatService.sendMessage(message)
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
			{source: require('../../source/image/chat/record.png'),
				type: MediaButtonType.recordVideo, title: 'Record',},
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
				this.openCamera()
				break
			case MediaButtonType.recordVideo:
				this.pushToRecordVideo()
				break
			default: ;
		}
	}

	openPhotoLibrary() {
		ImagePicker.openPicker({
			multiple: true
		}).then(images => {
			if (images && images.length) {
				images.map((item) => {
					this.appendNewImageMessage(MessageMediaType.image, item.path)
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
			if (image) {
				this.appendNewImageMessage(MessageMediaType.image, image.path)
			}
		});
	}

	appendNewImageMessage(type, url) {
		let message = new Message()

		const {Name} = this.getUserInfo()
		message.nickName = Name
		message.mediaType = type
		message.senderId = this.getUserInfo().ChatID
		message.message = url
		message.createdAt = this.getDateTimeISO()
		message.updatedAt = message.createdAt

		this.appendNewMessage(message)
	}

	pushToRecordVideo() {
		// let layout = {
		// 	component: {
		// 		name: 'RecordVideoViewController',
		// 		passProps: {
		//
		// 		},
		// 		options: {
		// 			modalPresentationStyle: 'fullScreen',
		// 			topBar: {
		// 				visible: false,
		// 			},
		// 			bottomTabs: {
		// 				visible: false,
		// 				drawBehind: false,
		// 			}
		// 		}
		// 	}
		// }
		//
		// if (PLATFORM.isIOS) {
		// 	Navigation.showModal(layout)
		// }else {
		// 	Navigation.push(this.props.componentId, layout);
		// }

		Navigation.showOverlay({
			component: {
				name: 'VideoPreview',
				options: {
					layout: {
						componentBackgroundColor: 'transparent',
					},
					overlay: {
						interceptTouchOutside: true
					}
				}
			}
		});

	}

	renderItem(message) {
		return (
			<ChatItem
				message = {message}
				isPeer = {message.senderId !== this.getUserInfo().ChatID}
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
	recordVideo: 2,
	location: 3,
}
