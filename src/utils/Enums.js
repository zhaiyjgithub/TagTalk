import {Platform} from 'react-native'

const PLATFORM = {
	isIOS: (Platform.OS === 'ios'),
	isAndroid: (Platform.OS === 'android')
}

const EventName = {
	websocket: {
		onOpen: 'onOpen',
		onmessage: 'onmessage',
		onerror: 'onerror',
		onclose: 'onclose'
	}
}

export {
	PLATFORM,
	EventName
}
