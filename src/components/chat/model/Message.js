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
		this.roomId = ''

		this.nickName = ''
		this.avatar = ''
		this.user = null
		this.memtions = []

		this.type = ''
		this.text = ''
		this.imageURL = ''
		this.audioURL = ''
		this.videoURL = ''
		this.webviewURL = ''
		this.mapview = {}

		this.createdAt = null
		this.updatedAt = null
	}
}

export {Message}
