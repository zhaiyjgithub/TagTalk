import BaseService from '../../commonComponents/BaseService';
import {API_Contacts} from '../../../utils/API';
import {HTTP} from '../../../utils/HttpTools';
import {ResponseCode} from '../../../utils/Enums';

export default class MessageService {
	constructor() {
		this.baseService = new BaseService()
	}

	requestDialogList(chatId, success, fail) {
		let param = {
			ChatID: chatId
		}

		this.baseService.sendRequest(API_Contacts.GetContactsByChatID, param, (response) => {
			if (response.code === ResponseCode.ok) {
				success && success(response.data)
			}
		},(error) => {
			fail && fail(error)
		})
	}

}
