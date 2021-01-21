import React, {useEffect, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Colors} from '../../utils/styles';
import MatchService from './MatchService';
import {ChannelType, MatchLikeTyp, MessageCategory, MessageMediaType} from '../../utils/Enums';
import {Message} from '../chat/model/Message';
import Animated, {
    Easing, interpolate,
    useAnimatedGestureHandler, useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
    call,
    runOnUI,
    runOnJS,
} from 'react-native-reanimated';
import {PanGestureHandler} from "react-native-gesture-handler";
import Card from './view/Card';
const {width} = Dimensions.get('window')

const MatchViewController = (props) => {
    const [dataSource, setDataSource] = useState([])
    const matchService: MatchService = new MatchService()
    const translation = {
        x: useSharedValue(0),
        y: useSharedValue(0)
    }
    const springConfig = {
        damping: 15,
        mass: 0.5,
        stiffness: 100,
        overshootClamping: false,
        restSpeedThreshold: 1,
        restDisplacementThreshold: 0.5,
    }
    let isEnd = false

    useEffect(() => {
        // requestNearByPeople()
    })

    const gestureHandler = useAnimatedGestureHandler({
        onStart:(_, ctx) => {
            ctx.startX = translation.x.value
            // ctx.startY = translation.y.value
        },
        onActive: (event, ctx) => {
            translation.x.value = ctx.startX + event.translationX
            // translation.y.value = ctx.startY + (event.translationY > 50 ? 50 : event.translationY)
        },
        onEnd: (event, ctx) => {
            let endPositionX = 0

            if (translation.x.value < 0) {
                endPositionX =  -(width - 60 + 100)
            }else {
                endPositionX = (width - 60 + 100)
            }
            translation.x.value = withSequence(withSpring(endPositionX, springConfig, () => {
                //这里表明了已经出去了可是范围， 那么card的opacity 已经设置到 0。
                isEnd = true
            }), withTiming(0, {
                duration: 50,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }, () => {
                isEnd = false // 这个回到原点过程不需要根据translationX进行opacity 变化
                //这里创建一个渐变动画， 显示第二张图的opacity.
            }))
            translation.y.value = withSpring(0)

            // runOnUI(someWorklet)('')
        }
    })

    const someWorklet = (greeting) => {
        console.log(greeting, 'From the UI thread');
    }

    const style = useAnimatedStyle(() => {
        const rotateZ = interpolate(translation.x.value, [-width/2.0, width/2.0], [15, -15], 'clamp') + 'deg'
        const opacity = interpolate(Math.abs(translation.x.value), [0, width/2.0], [1, 0.1], 'clamp')
        if (!isEnd) {//这个回到原点过程不需要根据translationX进行opacity 变化
            //这里使用translationX 用来计算card opacity。。。。
        }
        return {
            opacity: opacity,
            transform: [
                {translateX: translation.x.value,},
                {translateY: translation.y.value},
                {rotateZ: rotateZ}
            ]}
    })

    const handlerStageChanged = ({nativeEvent}) => {
        console.log('hello: ' + nativeEvent.state)
    }

    const getUserInfo = () => {return global.UserInfo}
    const requestNearByPeople = () => {
        const {ChatID} = getUserInfo()
        matchService.getNearbyPeople(ChatID, (data) => {
            setDataSource(data)
        }, () => {

        })
    }
    const clickToLike = (item) => {
        const {User} = item
        const peerChatId = User.ChatID
        const senderName = getUserInfo().Name
        const chatId = getUserInfo().ChatID

        addLikeStatus(peerChatId)

        const {Likes} = item
        if (Likes.findIndex((val) => {
            return val === chatId
        }) !== -1) {
            //如果是互粉， 那么就创建好友关系
            addNewFriend(chatId, peerChatId)
            sendCreateNewDialogMessage(senderName, chatId, peerChatId)
        }
    }

    const addLikeStatus = (peerChatId) => {
        matchService.addLikeStatus(peerChatId, MatchLikeTyp.like, (isSuccess) => {
            console.log(isSuccess ? 'Success' : 'Failed')
        }, () => {

        })
    }

    const addNewFriend = (chatId,friendId) => {
        matchService.addNewFriend(chatId, friendId, (isSuccess) => {
            console.log('add new friend: ' + isSuccess ? 'Success' : 'Failed')
        }, () => {

        })
    }

    const sendCreateNewDialogMessage = (senderName, chatId, friendId) => {
        let message = new Message()
        message.nickName = senderName
        message.mediaType = MessageMediaType.text
        message.senderId = chatId
        message.message = ''
        message.category = MessageCategory.newDialog
        message.channelType = ChannelType.single
        message.channelId = friendId

        matchService.sendNewMessageDialog(JSON.stringify(message))
    }

    const renderLikesItem = (dataSource) => {
        return dataSource.map((item, index) => {
            return(
                <Text key={index} style={{fontSize: 16, color: Colors.blue}}>{item}</Text>
            )
        })
    }

    const renderItem = () => {
        return dataSource.map((item, index) => {
            const {User, Likes} = item
            const {ChatID, Name} = User
            return (
                <TouchableOpacity onPress={() => {
                    clickToLike(item)
                }} key={index} style={{width: '100%', minHeight: 100, backgroundColor: Colors.white,
                    marginVertical: 10,
                }}>
                    <Text style={{fontSize: 18, color: Colors.black}}>{ChatID}</Text>
                    <Text style={{fontSize: 18, color: Colors.black}}>{Name}</Text>

                    {renderLikesItem(Likes)}
                </TouchableOpacity>
            )
        })
    }

    return(
		<SafeAreaView style={{flex: 1, backgroundColor: Colors.white, alignItems: 'center'}}>
			<PanGestureHandler onHandlerStateChange={handlerStageChanged} onGestureEvent={gestureHandler}>
				<Animated.View style={[{marginTop: 30,}, style]}>
                    <Card />
				</Animated.View>
			</PanGestureHandler>

		</SafeAreaView>
	)
}

export default MatchViewController

