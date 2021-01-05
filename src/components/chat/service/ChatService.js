import {IM} from '../../../utils/IM';
import {Message} from '../model/Message';

export default class ChatService {
	constructor() {

	}

	sendMessage(message: Message) {
		IM.sendMessage(JSON.stringify(message))
	}

}
