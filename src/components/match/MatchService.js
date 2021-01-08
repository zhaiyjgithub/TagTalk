import BaseService from '../commonComponents/BaseService';
import {API_Contacts, API_Match} from '../../utils/API';
import {ResponseCode} from '../../utils/Enums';
import {IM} from '../../utils/IM';

export default class MatchService {
	constructor() {
		this.baseService = new BaseService()
	}

	getNearbyPeople(chatId, success, fail) {
		let param = {
			ChatID: chatId
		}

		this.baseService.sendRequest(API_Match.GetNearByPeople, param, (response) => {
			if (response && response.code === ResponseCode.ok) {
				const {data} = response
				success && success(data)
			}
		}, (error) => {
			fail && fail(error)
		})
	}

	addLikeStatus(peerChatId, status, success, fail) {
		let param = {
			ChatID: this.baseService.getUserChatID(),
			PeerChatId: peerChatId,
			Type: status
		}

		this.baseService.sendRequest(API_Match.AddLikeStatus, param, (response) => {
			success && success((response && response.code === ResponseCode.ok))
		}, (error) => {
			fail && fail(error)
		})
	}

	addNewFriend(chatId, friendId, success, fail) {
		let param = {
			ChatID: chatId,
			FriendID: friendId
		}

		this.baseService.sendRequest(API_Contacts.AddNewFriend, param, (response) => {
			success && success((response && response.code === ResponseCode.ok))
		}, (error) => {
			fail && fail(error)
		})
	}

	sendNewMessageDialog(message) {
		//在线/离线消息
		IM.sendMessage(message)
	}
}
