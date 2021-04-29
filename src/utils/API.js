
const BaseUrl = "http://localhost:8090/"
const WebsocketBaseUrl = "ws://localhost:8090/"

const API_User = {
	SendSignUpPin: 'User/SendSignUpPin',
	RegisterNewDoctor: 'User/RegisterNewDoctor',
	Login: 'User/Login',
	UploadProfile: 'User/UploadProfile',
	Avatar: 'User/Avatar',
	ImageWalls: 'User/ImageWalls',
	GetImageWall: "User/GetImageWall",
	getUserInfo: 'User/GetUserInfo',
	UpdateBasicProfile: 'User/UpdateBasicProfile',
	UpdateTags: 'User/UpdateTags',
	GetTags: 'User/GetTags'

}

const API_Contacts = {
	GetContactsByChatID: 'Contacts/GetContactsByChatID',
	AddNewFriend: 'Contacts/AddNewFriend'
}

const API_Match = {
	GetNearByPeople: 'Match/GetNearByPeople',
	AddLikeStatus: 'Match/AddLikeStatus'
}

export {
	BaseUrl,
	WebsocketBaseUrl,
	API_User,
	API_Contacts,
	API_Match,
}
