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
import {BaseNavigatorOptions} from '../../utils/Navigator';
import RNFS from "react-native-fs"
import {BaseUrl, WebsocketBaseUrl} from '../../utils/API';
import {Utils} from '../../utils/utils';
import {IM} from '../../utils/IM';

export default class MessageViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			msg: '',
		}

		this.ws = null
	}

	componentDidMount() {
		const {Email } = this.getUserInfo()
		IM.initWebsocket(Email)
	}

	getUserInfo() {
		return global.UserInfo
	}

	pushToChatRoom() {
		// Navigation.push(this.props.componentId, {
		// 	component: {
		// 		name: 'ChatViewController',
		// 		passProps: {
		// 			uid: 98
		// 		},
		// 		options: BaseNavigatorOptions('Chat')
		// 	}
		// });

		Navigation.push(this.props.componentId, {
			component: {
				name: 'DBTestController',
				passProps: {
					uid: 98
				},
				options: BaseNavigatorOptions('Chat')
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
