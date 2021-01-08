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
import {EventName, MessageCategory} from '../../utils/Enums';
import {Navigation} from 'react-native-navigation';
import {Colors, FontFamily} from '../../utils/styles';
import StoryHeader from './view/StoryHeader';
import MessageDialogItem from './view/MessageDialogItem';
import ContactItem from '../contacts/view/contactItem';
import {BaseNavigatorOptions} from '../../utils/Navigator';
import RNFS from "react-native-fs"
import {BaseUrl, WebsocketBaseUrl} from '../../utils/API';
import {Utils} from '../../utils/utils';
import {IM} from '../../utils/IM';
import MessageService from './service/MessageService';

export default class MessageViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			msg: '',
			dialogDataSource: []
		}

		this.ws = null
		this.messageService = new MessageService()

		this.addEventListener()
	}

	componentDidMount() {
		this.login()
	}

	componentWillUnmount(): void {
		this.onMessageOpenListener && this.onMessageOpenListener.remove()
		this.onMessageReceiverListener && this.onMessageReceiverListener.remove()
	}

	addEventListener() {
		this.onMessageOpenListener = DeviceEventEmitter.addListener(EventName.websocket.onOpen, () => {
			this.requestDialogList()
		})

		this.onMessageReceiverListener = DeviceEventEmitter.addListener(EventName.websocket.onmessage, (e) => {
			if (e && e.data) {
				let message = JSON.parse(e.data)
				console.log(this.props.componentId + ' receive message: ' + JSON.stringify(message))

				if (message.category === MessageCategory.newDialog) {
					alert('New dialog')
				}
			}
		})
	}

	login() {
		const {ChatID} = this.getUserInfo()
		IM.initWebsocket(ChatID)
	}

	requestDialogList() {
		const {ChatID} = this.getUserInfo()
		this.messageService.requestDialogList(ChatID, (data) => {
			this.setState({dialogDataSource: data})
		})
	}

	getUserInfo() {
		return global.UserInfo
	}

	pushToChatRoom(friendInfo) {
		const {Name} = friendInfo
		Navigation.push(this.props.componentId, {
			component: {
				name: 'ChatViewController',
				passProps: {
					friendInfo: friendInfo
				},
				options: BaseNavigatorOptions(Name)
			}
		});
	}

	renderItem(item) {
		return(
			<MessageDialogItem
				info = {item}
				didSelectedItem={() =>{
					this.pushToChatRoom(item)
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
		const {dialogDataSource} = this.state
		return(
			<SafeAreaView style={{flex: 1}}>
				<FlatList
					style={{flex: 1}}
					data={dialogDataSource}
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
