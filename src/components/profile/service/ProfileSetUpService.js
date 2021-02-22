import RNFS from 'react-native-fs';
import ToastMsg from '../../../utils/ToastMsg';
import {Gender} from '../../../utils/utils';
import BaseService from '../../commonComponents/BaseService';

export default class ProfileSetUpService {
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

	UploadProfile = (chatId, gender, bio, pImage, beginCB, progressCB) => {
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
			beginCB && beginCB(jobId)
		};

		let uploadProgress = (response) => {
			let percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
			console.log('UPLOAD IS ' + percentage + '% DONE!');
			progressCB && progressCB(percentage)
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
