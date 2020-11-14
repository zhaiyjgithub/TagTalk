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
		Navigation.push(this.props.componentId, {
			component: {
				name: 'ChatViewController',
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

	createFile() {
		let path = RNFS.DocumentDirectoryPath + '/test1.txt';
// write the file
		RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
		.then((success) => {
			console.log('FILE WRITTEN!');
		})
		.catch((err) => {
			console.log(err.message);
		});
	}

	uploadFiles() {
		let uploadUrl = 'http://localhost:8090/upload';  // For testing purposes, go to http://requestb.in/ and create your own link
// create an array of objects of the files you want to upload
		let files = [
			{
				name: 'test1',
				filename: 'test2.txt',
				filepath: RNFS.DocumentDirectoryPath + '/test2.txt',
				filetype: 'text/plain'
			},
			{
				name: 'test',
				filename: 'test.txt',
				filepath: RNFS.DocumentDirectoryPath + '/test.txt',
				filetype: 'text/plain'
			},
		];

		let uploadBegin = (response) => {
			let jobId = response.jobId;
			console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
		};

		let uploadProgress = (response) => {
			let percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
			console.log('UPLOAD IS ' + percentage + '% DONE!');
		};

// upload files
		RNFS.uploadFiles({
			toUrl: uploadUrl,
			files: files,
			method: 'POST',
			headers: {
				'Accept': 'application/json',
			},
			fields: {
				'hello': 'world',
			},
			begin: uploadBegin,
			progress: uploadProgress
		}).promise.then((response) => {
			if (response.statusCode === 200) {
				console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
			} else {
				console.log('SERVER ERROR');
			}
		}).catch((err) => {
			if(err.description === "cancelled") {
				// cancelled by user
			}
			console.log(err);
		});
	}
}
