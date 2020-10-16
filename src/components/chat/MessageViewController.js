import React, {Component} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	FlatList,
	View,
	Text,
	RefreshControl,
	TouchableOpacity,
	Image,
	DeviceEventEmitter
} from 'react-native';
import {EventName} from '../../utils/Enums';
import {Navigation} from 'react-native-navigation';
import {Colors} from '../../utils/styles';

export default class MessageViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			msg: ''
		}

		this.ws = {}
	}

	componentDidMount() {
		this.initWebsocket()
	}

	initWebsocket() {
		let ws = new WebSocket("ws://localhost:8088/ws?uid=3378")
		this.ws = ws

		ws.onopen = () => {
			// connection opened
			console.log('Connection opened')
			this.sendEvents(EventName.websocket.onOpen, null)
		};

		ws.onmessage = (e) => {
			// a message was received
			console.log(e.data);
			this.sendEvents(EventName.websocket.onOpen, e)
		};

		ws.onerror = (e) => {
			// an error occurred
			console.log(e)
			this.sendEvents(EventName.websocket.onerror, e)
		};

		ws.onclose = (e) => {
			// connection closed
			console.log(e)
			this.sendEvents(EventName.websocket.onclose, e)
		};
	}

	sendEvents(eventName,payload) {
		DeviceEventEmitter.emit(eventName, payload)
	}

	pushToChatRoom() {
		Navigation.push(this.props.componentId, {
			component: {
				name: 'ChatViewController',
				passProps: {
					uid: 98
				},
				options: {
					topBar: {
						title: {
							text: 'Jimmy'
						}
					},
				}

			}
		});
	}

	renderItem() {
		return(
			<TouchableOpacity onPress={() => {
				this.pushToChatRoom()
			}} style={{marginHorizontal: 20, paddingBottom: 20}}>
				<View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
					<Image style={{width: 66, height: 66, borderRadius: 33, overflow: 'hidden'}} source={require('../../source/image/test/Group7.png')}/>

					<View style={{justifyContent: 'center', marginLeft: 13, flex: 1}}>
						<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
							<Text numberOfLines={1} style={{fontFamily: 'Helvetica', fontSize: 17, color: Colors.black}}>{'Jimmy'}</Text>
							<Text numberOfLines={1} style={{fontFamily: 'Helvetica', fontSize: 12, color: Colors.gray}}>{'04:00 pm'}</Text>
						</View>
						<Text numberOfLines={1} style={{fontFamily: 'Helvetica', fontSize: 14, color: Colors.gray, marginTop: 8}}>{'Sounds cool'}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		return(
			<View style={{flex: 1}}>
				<FlatList
					style={{flex: 1}}
					data={[1, 2, 3]}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					ListHeaderComponent={() => {
						return(
							<View style={{height: 20}}/>
						)
					}}
				/>
			</View>
		)
	}
}
