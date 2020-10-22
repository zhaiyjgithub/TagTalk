import React, {Component, Fragment} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	FlatList,
	View,
	Text,
	RefreshControl,
	TouchableOpacity,
	Image,
	DeviceEventEmitter,
	TextInput
} from 'react-native';
import {EventName} from '../../utils/Enums';
import {Navigation} from 'react-native-navigation';
import {Colors, FontFamily} from '../../utils/styles';
import StoryHeader from './view/StoryHeader';
import MessageDialogItem from './view/MessageDialogItem';
import ContactItem from '../contacts/view/contactItem';

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
			<MessageDialogItem
				didSelectedItem={() =>{
					this.pushToChatRoom()
				}}
			/>
		)
	}

	renderSearchBar() {
		return (
			<View style={{flex: 1, height: 40, marginTop: 20,
				flexDirection: 'row', alignItems: 'center', marginHorizontal: 20,
				backgroundColor: Colors.searchBar, borderRadius: 20,
			}}>
				<Image source={require('../../source/image/chat/search.png')} style={{width: 18, height: 18, marginLeft: 16, marginRight: 5 }}/>
				<TextInput
					placeholder={'Search'}
					placeholderColor={Colors.placeholder}
					style={{
					flex: 1,
					paddingVertical: 0, paddingHorizontal: 5,
					fontSize: 15, color: Colors.black,
					marginRight: 10, height: 40, fontFamily: FontFamily.helvetica
				}}/>
			</View>
		)
	}

	render() {
		return(
			<SafeAreaView style={{flex: 1}}>
				<FlatList
					style={{flex: 1}}
					data={[1, 2, 3]}
					renderItem={({item}) => this.renderItem(item)}
					keyExtractor={(item, index) => {
						return 'key' + item.key + index
					}}
					ListHeaderComponent={() => {
						return(
							<Fragment>
								{this.renderSearchBar()}
								<StoryHeader
									dataSource={[1, 2, 3, 1, 2, 3]}
								/>
							</Fragment>

						)
					}}
				/>
			</SafeAreaView>
		)
	}
}
