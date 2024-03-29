import RNFS from 'react-native-fs';
import ToastMsg from '../../../utils/ToastMsg';
import {Gender} from '../../../utils/utils';
import {BaseService, UploadFileModel} from '../../../services/BaseService';
import {API_User} from '../../../utils/API';

export default class ProfileService {
	constructor() {
		this.baseService = new BaseService()
	}

	CheckParam = (avatar, gender, bio) => {
		if (!avatar.length) {
			ToastMsg.show('Avatar is required.')
			return false
		}

		if (gender === Gender.unknown) {
			ToastMsg.show('Gender is required.')
			return false
		}

		if (!bio.length) {
			ToastMsg.show('About you is required.')
			return false
		}

		return true
	}

	UploadProfile = (chatId, gender, bio, pImage, success, fail) => {
		if (!this.CheckParam(pImage.Path, gender, bio)) {
			return
		}

		let uploadUrl = 'http://localhost:8090/User/UploadImageWalls';
		let files = [
			{
				name: pImage.Name,
				filename: pImage.Name,
				filepath: pImage.Path,
				filetype: 'image/jpeg'
			},
		];

		console.log('UploadProfile: ', files)
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
				Bio: bio,
				Gender: gender
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
			console.log(err);

			fail && fail()
		});
	}

	updateAvatar =  (chatId, name, path, success, fail) => {
		const param = {ChatID: chatId}
		const files = [(new UploadFileModel(name, name, path, 'image/jpeg'))]
		this.baseService.uploadFiles(param, files, () => {
			success && success()
		}, (error) => {
			fail && fail()
		})
	}

	getUserInfo = (chatId, success, fail) => {
		const param = {
			ChatID: chatId
		}
		this.baseService.sendRequest(API_User.getUserInfo, param, (data) => {
			success && success(data)
		}, () => {

		})
	}

	updateBasicProfile = (chatId, name, bio, genderIndex, success, fail) => {
		if (!name || !name.length) {
			ToastMsg.show('Name is required')
			return
		}
		if (!bio || !bio.length) {
			ToastMsg.show('Bio is required')
			return
		}
		const genders = [Gender.male, Gender.female]
		const param = {
			ChatID: chatId,
			Name: name,
			Bio: bio,
			Gender: genders[genderIndex]
		}
		this.baseService.sendRequest(API_User.UpdateBasicProfile, param, (data) => {
			success && success()
		}, () => {
			fail && fail()
		})
	}

	updateTags = (chatId, tags, success, fail) => {
		if (!tags || !tags.length) {
			ToastMsg.show('Tags is required!')
			return
		}
		const param = {
			ChatID: chatId,
			Names: tags.join('|')
		}
		this.baseService.sendRequest(API_User.UpdateTags, param, () => {
			success && success()
		}, () => {
			fail && fail()
		})
	}

	getTags = (chatId, success, fail) => {
		const param = {
			ChatID: chatId
		}
		this.baseService.sendRequest(API_User.GetTags, param, (data) => {
			const dataSource = (data && data.length ? data.split('|') : [])
			success && success(dataSource)
		}, () => {

		})
	}

}
