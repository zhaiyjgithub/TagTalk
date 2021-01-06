import {HTTP} from '../../utils/HttpTools';
export default class BaseService {
	constructor() {
	}

	getUserInfo() {
		return global.UserInfo
	}

	getUserChatID() {
		return this.getUserInfo().ChatID
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
