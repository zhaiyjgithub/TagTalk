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
    TextInput
} from 'react-native';
import {Colors} from '../../utils/styles';

export default class MatchViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
    }

    componentDidMount() {
        this.setState({dataSource: this.requestNearByPeople})
    }

    getUserInfo() {
        return global.UserInfo
    }

    requestNearByPeople() {
        const {Email} = this.getUserInfo()
        if (Email === 'yuanji.zhai@outlook.com') {
            return [
                {
                    user: {
                        name: 'yuanji',
                        headerIcon: '',
                        chatId: 334082907746340864,
                    },
                    likes: new Set([334080379222757376]) //Set()
                }
            ]
        }else {
            return [
                {
                    user: {
                        name: 'yuanji',
                        headerIcon: '',
                        chatId: 334080379222757376,
                    },
                    likes: new Set([334082907746340864]) //Set()
                }
            ]
        }
    }

    clickLike() {
        const {dataSource} = this.state
        const {ChatID} = this.getUserInfo()
        let item = dataSource[0]

        if (item.likes.has(ChatID)) {
            //匹配成功l
            //创建本地数据库，记录聊天列表
            //进入聊天界面
            // 创建双方的好友关系
            //发送消息给对方。如果对方收到，就收到websocket 消息。本地处理如上。否则，收到推送。
        }
    }

    render() {
        return(
            <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => {
                    this.clickLike()
                }} style={{width: 100, height: 100, justifyContent: 'center', alignItems: 'center',
                    backgroundColor: Colors.blue
                }}>
                    <Text>{'Match'}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}
