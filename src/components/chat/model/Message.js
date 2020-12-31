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


import {ChannelType, MessageType} from '../../../utils/Enums';

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
		this.user = {}
		this.memtions = []

		this.channelType = ChannelType.single
		this.channelId =  0

		this.messageType = MessageType.Text
		this.message = ''

		this.createdAt = null
		this.updatedAt = null
	}
}

export {Message}
