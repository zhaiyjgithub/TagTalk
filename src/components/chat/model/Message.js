// type Message struct {
// 	ID string
// 	RoomID int64
//
// 	NickName string
// 	Avatar string
// 	User *User
// 	Mentions []*User
//
// 	Type MessageType
// 	Text string
// 	ImageURL string
// 	AudioURL string
// 	VideoURL string
// 	WebViewURL string
// 	MapView mapView
//
// 	CreatedAt time.Time
// 	UpdatedAt time.Time
// }


import {ChannelType, MessageCategory, MessageMediaType} from '../../../utils/Enums';
import {Utils} from '../../../utils/utils';

class User {
	constructor() {
		this.id = 0
		this.name = ''
		this.avatar = ''
	}
}

class Message {
	constructor() {
		this.id = ''

		this.nickName = ''
		this.avatar = ''
		this.senderId = ''
		this.memtions = []

		this.channelType = ChannelType.single
		this.channelId =  0

		this.category = MessageCategory.normal
		this.mediaType = MessageMediaType.text
		this.message = ''

		this.createdAt = Utils.getDateTimeISO()
		this.updatedAt = Utils.getDateTimeISO()
	}
}

export {Message}
