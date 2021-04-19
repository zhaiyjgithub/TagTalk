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
    TextInput, Dimensions,
    ScrollView,
} from 'react-native';
import CacheTool from '../../../utils/CacheTool';
import {CacheKey} from '../../../utils/Enums';
import {Router} from '../../../route/router';
import {Colors} from '../../../utils/styles';
import ContainerView from '../../../baseComponents/ContainerView';
import PanelView from '../../commonComponents/PanelView';
import {API_User, BaseUrl} from '../../../utils/API';
import FastImage from 'react-native-fast-image';
import SegmentedControlTab from "react-native-segmented-control-tab";
import SeparateLine from '../../commonComponents/SeparateLine';
import ProfileImageWallService from '../service/ProfileImageWallService';

let data = []
for (let i = 0; i < 50; i ++) {
    data.push(i)
}

export default class ProfileViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            imageWalls: []
        }

        this.imageService = new ProfileImageWallService()
    }
    componentDidMount() {
        CacheTool.load(CacheKey.userInfo, (response) => {
            const userInfo = JSON.parse(response)
            ACCOUNT = userInfo

            this.getImageWalls()
        }, () => {

        })


    }

    getImageWalls = () => {
        const {ChatID} = ACCOUNT
        this.imageService.GetImageWalls(ChatID, (data: Array) => {
            this.setState({imageWalls: data})
        }, () => {})
    }

    signOut = () => {
        CacheTool.remove(CacheKey.userInfo)
        Router.showGuide()
    }

    renderPanBar = () => {
        return (
            <View style={{width: 80, height: 4, borderRadius: 2, backgroundColor: Colors.lightGray, marginVertical: 8}}/>
        )
    }

    renderTagList = () => {
        const defaultTags= [
            'Adventure', 'Animal', 'Dancing',
            'Foreign culture', 'Hitchiking', 'Local food', 'More'
        ]
        return (
            <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap'}}>
                {defaultTags.map((item, idx) => {
                    return this.renderTag(item, idx)
                })}
            </View>
        )
    }

    renderTag = (item, idx) => {
        return (
            <View  key={idx} style={{height: 40, borderRadius: 20, backgroundColor: Colors.blue, justifyContent: 'center',
                marginTop: 10, marginRight: 10, paddingHorizontal: 16,
            }}>
                <Text style={{color: Colors.white, fontSize: 16, }}>{item}</Text>
            </View>
        )
    }

    renderUserInfo = () => {
        const {Name, Avatar, Bio} = ACCOUNT
        const uri = BaseUrl + API_User.Avatar + '?name=' + 'ride.png'
        return (
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingVertical: 8}}>
                <FastImage
                    style={{width: 64, height: 64, borderRadius: 32, backgroundColor: 'red', borderWidth: 2,
                        borderColor: Colors.blue
                    }}
                    source={{
                        uri:  uri,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={{marginLeft: 16, justifyContent: 'space-between', flex: 1}}>
                    <Text numberOfLines={1} style={{fontSize: 24, color: Colors.black, fontWeight: 'bold'}}>{Name}</Text>
                    <Text style={{fontSize: 16, color: Colors.lightGray, marginTop: 8}}>{Bio}</Text>
                </View>
            </View>
        )
    }

    renderPostImage = (data) => {
        const {width, height} = Dimensions.get('window')
        const size = (width - 32)/4.0
        return data.map((item, idx) => {
            const {uri} = item
            return (
                <TouchableOpacity key={idx} activeOpacity={0.8}>
                    <Image resizeMode={'stretch'} source={{uri: uri}} style={{width: size, height: size}}/>
                </TouchableOpacity>
            )
        })
    }

    renderPostImages = () => {
        const {imageWalls} = this.state
        return (
            <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap', marginTop: 16,}}>
                {this.renderPostImage(imageWalls)}
            </View>
        )
    }

    renderInfoContainerView = () => {
        return (
            <View style={{width: '100%', alignItems: 'center', paddingHorizontal: 16,}}>
                {this.renderPanBar()}
                {this.renderUserInfo()}
                {this.renderTagList()}
                {this.renderPostImages()}
            </View>
        )
    }

    renderUserInfoHeader = () => {
        const {Name, Avatar, Bio} = ACCOUNT
        const uri = BaseUrl + API_User.Avatar + '?name=' + 'ride.png'
        const size = 96
        return (
            <View style={{alignItems: 'center', backgroundColor: Colors.white, marginTop: 100,
                paddingBottom: 16
            }}>
                    <FastImage
                        style={{width: size, height: size, borderRadius: size/2.0, backgroundColor: 'red', borderWidth: 6,
                            borderColor: Colors.white, position: 'absolute', top: -(size/2.0)
                        }}
                        source={{
                            uri:  uri,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                <Text numberOfLines={1} style={{width: '100%', fontSize: 24, color: Colors.black, textAlign: 'center',
                    fontWeight: 'bold', marginTop: size/2.0
                }}>{'Time cole'}</Text>
                <Text style={{width: '100%',fontSize: 14, color: Colors.lightGray, marginTop: 8, textAlign: 'center'}}>{'To be or to be, this is a question.'}</Text>
            </View>
        )
    }

    renderPageContainerHeaderIcon = (title, idx) => {
        return (
            <TouchableOpacity key={idx}>
                <Text style={{fontSize: 14, color: Colors.black}}>{title}</Text>
            </TouchableOpacity>
        )
    }

    renderPageContainerHeader = () => {
        const data = ['Pix', 'Tags', 'Timeline']
        return (
            <View style={{paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
                height: 30, marginTop: 16, justifyContent: 'space-between'
            }}>
                {data.map((val, idx) => {
                    return this.renderPageContainerHeaderIcon(val, idx)
                })}
            </View>
        )
}

    renderPageContainer = () => {
        return (
            <ScrollView pagingEnabled={true} horizontal={true}>
                {this.renderPixPage()}
                {this.renderTagsPage()}
                {this.renderTimelinePage()}
            </ScrollView>
        )
    }

    renderPixPage = () => {
        const {width, height} = Dimensions.get('window')
        return (
            <View style={{flex: 1, backgroundColor: 'blue', height: 500, width: width}}>
                {data.map((val, idx) => {
                    return <Text style={{width: '100%', height: 44}}>{val}</Text>
                })}
            </View>
        )
    }

    renderTagsPage = () => {
        const {width, height} = Dimensions.get('window')
        return (
            <View style={{flex: 1, backgroundColor: 'yellow',height: 500, width: width}}>
                {data.map((val, idx) => {
                    return <Text style={{width: '100%', height: 44}}>{val}</Text>
                })}
            </View>
        )
    }

    renderTimelinePage = () => {
        const {width, height} = Dimensions.get('window')
        return (
            <View style={{flex: 1, backgroundColor: 'red',height: 500, width: width}}>
                {data.map((val, idx) => {
                    return <Text style={{width: '100%', height: 44}}>{val}</Text>
                })}
            </View>
        )
    }

    render() {
        return(
            <ContainerView>
                <View style={{width: '100%', paddingHorizontal: 20, backgroundColor: Colors.systemGray}}>
                    {this.renderUserInfoHeader()}
                    {this.renderPageContainerHeader()}
                </View>
                <ScrollView style={{flex: 1, backgroundColor: Colors.systemGray,}} contentContainerStyle={{
                }}>
                    {this.renderPageContainer()}
                </ScrollView>
            </ContainerView>
        )
    }
}


// 'user info: ', { Name: 'West',
//     Email: '380842455@qq.com',
//     Phone: '',
//     Bio: '',
//     HeaderIcon: '',
//     Level: 0,
//     Password: '123456',
//     Gender: 0,
//     Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDUzNTQ2MDIsImlhdCI6MTYwNTM1MzcwMn0.NfaD1thViHX7POBvzCv7tS8hgdJ2qQPAjibKMLHBroE' }
