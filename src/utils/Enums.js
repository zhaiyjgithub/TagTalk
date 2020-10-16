import {Platform, Dimensions} from 'react-native'

const PLATFORM = {
	isIOS: (Platform.OS === 'ios'),
	isAndroid: (Platform.OS === 'android'),
	isX: Platform.OS === "ios" && !Platform.isPad && (Dimensions.get("window").height > 800 || Dimensions.get("window").width > 800)
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
