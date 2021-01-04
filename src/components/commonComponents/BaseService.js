import {HTTP} from '../../utils/HttpTools';
import {API_Contacts} from '../../utils/API';
import {ResponseCode} from '../../utils/Enums';
import {logger} from '@nozbe/watermelondb/utils/common';

export default class BaseService {
	constructor() {
	}

	getUserInfo() {
		return global.UserInfo
	}

	sendRequest(api, param, success, fail) {
		HTTP.post(api, param).then((response) => {
			console.log(JSON.stringify(response))
			success && success(response)
		}).catch((error) => {
			fail && fail(error)
		})
	}
}
