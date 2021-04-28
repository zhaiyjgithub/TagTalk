import {HTTP} from '../utils/HttpTools';
import RNFS from 'react-native-fs';
class BaseService {
	constructor() {
	}

	getUserInfo() {
		return global.UserInfo
	}

	getUserChatID() {
		return this.getUserInfo().ChatID
	}

	sendRequest(api, param, success, fail) {
		console.log(api, JSON.stringify(param))
		HTTP.post(api, param).then((response) => {
			console.log(JSON.stringify(response))
			success && success(response)
		}).catch((error) => {
			fail && fail(error)
		})
	}

	uploadFiles = (param, files:[UploadFileModel], success, fail) => {
		const uploadUrl = 'http://localhost:8090/User/UpdateAvatar';
		const uploadBegin = (response) => {
			let jobId = response.jobId;
			console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
		};
		const uploadProgress = (response) => {
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
			fields: param,
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
}

class UploadFileModel {
	constructor(name, fileName, filePath, fileType = 'image/jpeg') {
		// name: pImage.Name,
		// 	filename: pImage.Name,
		// 	filepath: pImage.Path,
		// 	filetype: 'image/jpeg'
		this.name = name
		this.filename = fileName
		this.filepath = filePath
		this.filetype = fileType
	}
}

export {
	BaseService,
	UploadFileModel
}
