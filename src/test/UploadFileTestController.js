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
	TouchableWithoutFeedback,
} from 'react-native';
import RNFS from 'react-native-fs';

export default class UploadFileTestController extends Component{
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
	render() {

	}
}

