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

const MessageMediaType = {
	text: 0,
	image: 1,
	audio: 2,
	video: 3,
	webView: 4,
	mapView: 5,
}

const MessageCategory = {
	normal: 0,
	newDialog: 1,
}

const ChannelType =  {
	single  : 1,
	group  : 2,
	broadcast  : 3
}

const MatchLikeTyp = {
	like: 0,
	disLike: 1,
	star: 2,
}


export {
	PLATFORM,
	EventName,
	MessageMediaType,
	CacheKey,
	ResponseCode,
	ChannelType,
	MatchLikeTyp,
	MessageCategory
}
