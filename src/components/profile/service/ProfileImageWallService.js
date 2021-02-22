import RNFS from 'react-native-fs';
import {Utils} from '../../../utils/utils';
import {ImageActionType} from '../controller/ProfileSetUpImageWallViewController';
import {HTTP} from '../../../utils/HttpTools';
import {API_User, BaseUrl} from '../../../utils/API';
import {ResponseCode} from '../../../utils/Enums';
import BaseService from '../../commonComponents/BaseService';

export default class ProfileImageWallService {
	constructor() {
		this.baseService = new BaseService()
	}

	GetImageWalls = (chatId, success, fail) => {
		const param = {
			ChatID: chatId
		}

		this.baseService.sendRequest(API_User.GetImageWall, param, () => {
			if (response && response.code === ResponseCode.ok) {
				let data = []
				response.data.forEach((item, idx) => {
					data.push({
						id: idx.toString(),
						type: ImageActionType.normal,
						uri: BaseUrl + API_User.ImageWalls + '?name=' + item,
						name: item
					})
				})

				if (data.length < 8) {
					let defaultImage = {
						id: data.length.toString(),
						type: ImageActionType.default,
						uri: require('../../../source/image/match/add-four.png')
					}
					data.push(defaultImage)
				}

				success && success(data)
			}else {
				fail && fail()
			}
		}, () => {
			fail && fail()
		})
	}

	preHandleNewImage = (chatId, allImages: Array) => {
		let newFiles = []
		let allFileNames = []

		allImages.forEach((item, idx) => {
			if (item.type === ImageActionType.normal) { // only upload the new image.
				if (!item.uri.startsWith('http')) {
					const newFileName = Utils.GenerateFileName(chatId, item.name)
					item.name = newFileName
					newFiles.push({
						name: newFileName,
						filename: newFileName,
						filepath: item.uri,
						filetype: 'image/jpeg'
					})
				}

				allFileNames.push(item.name)
			}
		})

		return {files: newFiles, fileNames: allFileNames}
	}

	UpdateImageWalls = (chatId, allImages, deleteImages, success, fail) => {
		let uploadUrl = 'http://localhost:8090/User/UploadImageWalls';
		let newImageInfo = this.preHandleNewImage(chatId, allImages)
		let files = newImageInfo.files;

		let uploadBegin = (response) => {
			let jobId = response.jobId;
			console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
		};

		let uploadProgress = (response) => {
			let percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
			console.log('UPLOAD IS ' + percentage + '% DONE!');
		};

		RNFS.uploadFiles({
			toUrl: uploadUrl,
			files: files,
			method: 'POST',
			headers: {
				'Accept': 'application/json',
			},
			fields: {
				ChatID: chatId,
				NewImageNames: newImageInfo.fileNames.join(','),
				DeleteImageNames: deleteImages.join(',')
			},
			begin: uploadBegin,
			progress: uploadProgress
		}).promise.then((response) => {
			if (response.statusCode === 200) {
				console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
				success && success()
			} else {
				console.log('SERVER ERROR');
				fail && fail()
			}
		}).catch((err) => {
			if(err.description === "cancelled") {
				// cancelled by user
			}

			fail && fail()
		});
	}
}
