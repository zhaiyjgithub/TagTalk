
const BaseUrl = "http://localhost:8090/"
const WebsocketBaseUrl = "ws://localhost:8090/"

const API_User = {
	SendSignUpPin: 'User/SendSignUpPin',
	RegisterNewDoctor: 'User/RegisterNewDoctor',
	Login: 'User/Login'
}

const API_Contacts = {
	GetContactsByChatID: 'Contacts/GetContactsByChatID',
	AddNewFriend: 'AddNewFriend'
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
