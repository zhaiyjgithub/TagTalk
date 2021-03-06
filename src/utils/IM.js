import {WebsocketBaseUrl} from './API';
import {EventName} from './Enums';
import {DeviceEventEmitter} from 'react-native';
import {json} from '@nozbe/watermelondb/decorators';

const IM = {
	ws: null,
	initWebsocket(chatId) {
		const url = (WebsocketBaseUrl + "ws?chatID=" + chatId)
		let ws = new WebSocket(url)
		this.ws = ws
		ws.onopen = () => {
			// connection opened
			console.log('Connection opened')
			this.sendEvents(EventName.websocket.onOpen, null)
		};

		ws.onmessage = (e) => {
			// a message was received
			console.log("onmessage: " + e.data);
			this.sendEvents(EventName.websocket.onmessage, e)
		};

		ws.onerror = (e) => {
			// an error occurred
			console.log("onerror: " + JSON.stringify(e))
			this.sendEvents(EventName.websocket.onerror, e)
		};

		ws.onclose = (e) => {
			// connection closed
			console.log('on close: ' + JSON.stringify(e))
			this.sendEvents(EventName.websocket.onclose, e)
		};
	},
	sendMessage(msg) {
		this.ws && this.ws.send(msg)
	},
	closeConnection() {
		this.ws && this.ws.close()
		this.ws = null
	},
	sendEvents(eventName,payload) {
		DeviceEventEmitter.emit(eventName, payload)
	}
}

export {
	IM
}
