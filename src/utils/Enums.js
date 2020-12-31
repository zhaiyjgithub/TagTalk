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

const CacheKey = {
	userInfo: 'userInfo'
}

const ResponseCode = {
	ok: 0,
	fail: 1,
	isExist: 4
}

const MessageType = {
	Text: 0,
	Image: 1,
	Audio: 2,
	Video: 3,
	WebView: 4,
	MapView: 5,
}

const ChannelType =  {
	single  : 1,
	group  : 2,
	broadcast  : 3
}


export {
	PLATFORM,
	EventName,
	MessageType,
	CacheKey,
	ResponseCode,
	ChannelType
}
