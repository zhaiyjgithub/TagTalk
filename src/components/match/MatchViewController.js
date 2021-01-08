import React, {Component, Fragment} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    FlatList,
    View,
    Text,
    RefreshControl,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
    TextInput,
    ScrollView
} from 'react-native';
import {Colors} from '../../utils/styles';
import MatchService from './MatchService';
import {ChannelType, MatchLikeTyp, MessageCategory, MessageMediaType} from '../../utils/Enums';
import ToastMsg from '../../utils/ToastMsg';
import {Message} from '../chat/model/Message';

export default class MatchViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }

        this.matchService = new MatchService()
    }

    componentDidMount() {
       this.requestNearByPeople()
    }

    getUserInfo() {
        return global.UserInfo
    }

    requestNearByPeople() {
        const {ChatID} = this.getUserInfo()
        this.matchService.getNearbyPeople(ChatID, (data) => {
            this.setState({dataSource: data})
        }, () => {

        })
    }

    clickToLike(item) {
        const {User} = item
        const peerChatId = User.ChatID
        const senderName = this.getUserInfo().Name
        const chatId = this.getUserInfo().ChatID

        this.addLikeStatus(peerChatId)

        const {Likes} = item
        if (Likes.findIndex((val) => {
            return val === chatId
        }) !== -1) {
            //如果是互粉， 那么就创建好友关系
            this.addNewFriend(chatId, peerChatId)
            this.sendCreateNewDialogMessage(senderName, chatId, peerChatId)
        }
    }

    addLikeStatus(peerChatId) {
        this.matchService.addLikeStatus(peerChatId, MatchLikeTyp.like, (isSuccess) => {
            console.log(isSuccess ? 'Success' : 'Failed')
        }, () => {

        })
    }

    addNewFriend(chatId,friendId) {
        this.matchService.addNewFriend(chatId, friendId, (isSuccess) => {
            console.log('add new friend: ' + isSuccess ? 'Success' : 'Failed')
        }, () => {

        })
    }

    sendCreateNewDialogMessage(senderName, chatId, friendId) {
        let message = new Message()
        message.nickName = senderName
        message.mediaType = MessageMediaType.text
        message.senderId = chatId
        message.message = ''
        message.category = MessageCategory.newDialog
        message.channelType = ChannelType.single
        message.channelId = friendId
        message.createdAt = this.getDateTimeISO()
        message.updatedAt = message.createdAt

        this.matchService.sendNewMessageDialog(JSON.stringify(message))
    }

    getDateTimeISO() {
        return (new Date()).toISOString()
    }


    renderLikesItem(dataSource) {
        return dataSource.map((item, index) => {
            return(
                <Text key={index} style={{fontSize: 16, color: Colors.blue}}>{item}</Text>
            )
        })
    }

    renderItem() {
        const {dataSource} = this.state
        return dataSource.map((item, index) => {
            const {User, Likes} = item
            const {ChatID, Name} = User
            return (
                <TouchableOpacity onPress={() => {
                    this.clickToLike(item)
                }} key={index} style={{width: '100%', minHeight: 100, backgroundColor: Colors.white,
                    marginVertical: 10,
                }}>
                    <Text style={{fontSize: 18, color: Colors.black}}>{ChatID}</Text>
                    <Text style={{fontSize: 18, color: Colors.black}}>{Name}</Text>

                    {this.renderLikesItem(Likes)}
                </TouchableOpacity>
            )
        })
    }

    render() {
        const {ChatID} = this.getUserInfo()
        return(
            <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 20, color: 'red'}}>{'MY ChatID: ' + ChatID}</Text>
                <ScrollView style={{flex: 1,}} contentContainerStyle={{backgroundColor: Colors.gray}}>
                    {this.renderItem()}
                </ScrollView>
            </SafeAreaView>
        )
    }
}
