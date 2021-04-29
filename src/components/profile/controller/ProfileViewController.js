import React, {Component} from 'react';
import {Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import CacheTool from '../../../utils/CacheTool';
import {CacheKey, PLATFORM} from '../../../utils/Enums';
import {Router} from '../../../route/router';
import {Colors} from '../../../utils/styles';
import ContainerView from '../../../baseComponents/ContainerView';
import {API_User, BaseUrl} from '../../../utils/API';
import FastImage from 'react-native-fast-image';
import ProfileImageWallService from '../service/ProfileImageWallService';
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker';
import ProfileService from '../service/ProfileService';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../../utils/Navigator';

let data = []
for (let i = 0; i < 56; i ++) {
    data.push(i)
}

const ImageWalls = [1, 2, 3, 4]

export default class ProfileViewController extends Component{
    static options(passProps) {
        return {
            topBar: {
                title: {
                    text: 'Profile'
                },
                rightButtons: [
                    {
                        id: 'settings',
                        enabled: true,
                        disableIconTint: false,
                        color: Colors.black,
                        icon: require('../../../source/image/profile/setting-two.png'),
                    },
                ]
            },
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            imageWalls: [],
            imageIndex: 0,
            avatarUri: ''
        }

        this.imageService = new ProfileImageWallService()
        this.profileService = new ProfileService()
        this.navigationEventListener = Navigation.events().bindComponent(this)
    }

    componentDidMount() {
        this.getTags()
    }

    componentWillUnmount() {
        this.navigationEventListener && this.navigationEventListener.remove();
    }

    navigationButtonPressed({ buttonId }) {
        if (buttonId === 'settings') {
            this.openSettings()
        }else if (buttonId === 'star') {

        }
    }

    getTags = () => {
        const {ChatID} = ACCOUNT
        this.profileService.getTags(ChatID, (data) => {
            this.setState({tags: data})
        })
    }

    openSettings = () => {
        const layout = {
            component: {
                name: 'SettingsViewController',
                passProps: {
                },
                options: BaseNavigatorOptions('Settings')
            }
        }
        Navigation.push(this.props.componentId, layout);
    }

    openUpdateBasicProfile = () => {
        const {Name, Bio, Gender} = ACCOUNT
        const layout = {
            component: {
                name: 'UpdateBasicProfileViewController',
                passProps: {
                    name: Name,
                    bio: Bio,
                    gender: Gender,
                    onSuccess: () => {
                        const {ChatID} = ACCOUNT
                        this.getUserInfo(ChatID)
                    }
                },
                options: BaseNavigatorOptions('My Profile')
            }
        }
        Navigation.push(this.props.componentId, layout);
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

    renderTagList = () => {
        const {tags} = this.state
        return (
            <TouchableOpacity onPress={this.openTags} style={{flexDirection: 'row', flexWrap: 'wrap', backgroundColor: Colors.white,
                marginTop: 8
            }}>
                {tags.map((item, idx) => {
                    return this.renderTag(item, idx)
                })}
            </TouchableOpacity>
        )
    }

    openTags = () => {
        const {tags} = this.state
        Navigation.push(this.props.componentId, {
            component: {
                name: 'AddTagsViewController',
                passProps: {
                    tags: tags,
                    isShowLargeTitle: false,
                    onSuccess: () => {
                        this.getTags()
                    }
                },
                options: BaseNavigatorOptions('Tags')
            }
        });
    }

    renderTag = (item, idx) => {
        return (
            <View key={idx} style={{height: 24, borderRadius: 10, backgroundColor: Colors.blue, justifyContent: 'center',
                marginTop: 8, marginRight: 8, paddingHorizontal: 8,
            }}>
                <Text style={{color: Colors.white, fontSize: 16, }}>{item}</Text>
            </View>
        )
    }

    onClickUserName = () => {
        this.openUpdateBasicProfile()
    }

    renderUserInfoHeader = () => {
        const {Name, Avatar, Bio} = ACCOUNT
        const {avatarUri} = this.state
        const uri = avatarUri.length ? avatarUri : (BaseUrl + API_User.Avatar + '?name=' + Avatar)
        const size = 80
        return (
            <View style={{ borderRadius: 4, marginHorizontal: 20, paddingVertical: 16,
                paddingHorizontal: 16,
                backgroundColor: Colors.white, marginTop: -24}}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={this.showActionSheet}>
                        <FastImage
                            style={{width: size, height: size, borderRadius: 8,
                            }}
                            source={{
                                uri:  uri,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onClickUserName} style={{marginLeft: 16, flex: 1}}>
                        <Text numberOfLines={1} style={{fontSize: 24, color: Colors.black, textAlign: 'left',
                            fontWeight: 'bold',
                        }}>{Name}</Text>
                        <Text numberOfLines={2} style={{fontSize: 14, color: Colors.lightGray, marginTop: 8, textAlign: 'left',
                           width: '100%'
                        }}>{Bio}</Text>
                    </TouchableOpacity>
                </View>
                {this.renderTagList()}
            </View>

        )
    }

    onAnimationEnd = (e) =>{
        const {width, height} = Dimensions.get('window')
        const offSetX = e.nativeEvent.contentOffset.x
        const currentPage = offSetX / (width)
        this.setState({imageIndex: parseInt(currentPage)})
    }

    renderImageWall = () => {
        return (
          <View style={{width: '100%'}}>
              <ScrollView
                  onMomentumScrollEnd={(e) => {
                      this.onAnimationEnd(e)
                  }}
                  style={{height: 196, width: '100%'}} pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false}>
                  {ImageWalls.map((val, idx) => {
                      return this.renderImageWallItem(idx)
                  })}
              </ScrollView>
              {this.renderImageWallIndicator()}
          </View>
        )
    }

    renderImageWallItem = (idx) => {
        const {width, height} = Dimensions.get('window')
        return (
            <View key={idx} style={{width: width}}>
                <FastImage
                    style={{width: '100%', height: 196, marginBottom: 4}}
                    source={{
                        uri: `https://picsum.photos/id/${idx + 10}/400/400`,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
        )
    }

    renderImageWallIndicator = () => {
        const {imageIndex} = this.state
        return (
            <View style={{flexDirection: 'row', alignItems: 'center',
                position: 'absolute', top: 8, right: 8,
            }}>
                {ImageWalls.map((item, idx) => {
                    return (
                        <View key={idx} style={{width: 8, height: 8, borderRadius: 4,
                            backgroundColor: (idx === imageIndex) ? Colors.blue : Colors.systemGray,
                            marginRight: 4
                        }}/>
                    )
                })}
            </View>
        )
    }

    renderTimelineImageItem = (idx) => {
        const {width, height} = Dimensions.get('window')
        const number = 4
        const size = (width - 32 - 4*(number - 1))/number
        return (
            <FastImage
                style={{width: size, height: size, marginBottom: 4, borderRadius: 4}}
                source={{
                    uri: `https://picsum.photos/id/${idx + 10}/400/400`,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
        )
    }

    renderTimelinePage = () => {
        return (
            <View style={{width: '100%', flexDirection: 'row',
                flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16,
                marginTop: 16,
            }}>
                {data.map((val, idx) => {
                    return this.renderTimelineImageItem(idx)
                })}
            </View>
        )
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    onClickActionSheet = (index) => {
        if (index === 0) {
            this.openPhotoLibrary()
        }else if (index === 1) {
            this.openCamera()
        }
    }

    updateAvatar = (name, uri) => {
        this.setState({avatarUri: uri})
        const {ChatID} = ACCOUNT
        this.profileService.updateAvatar(ChatID, name, uri, () => {
            this.getUserInfo(ChatID)
        }, () => {
        })
    }

    getUserInfo = (ChatID) => {
        this.profileService.getUserInfo(ChatID, (account) => {
            const newAccount = Object.assign({}, ACCOUNT, account)
            ACCOUNT = newAccount
            console.log('new account: ', newAccount)
            this.saveUserAccountToLocal(newAccount)
            this.forceUpdate()
        })
    }

    saveUserAccountToLocal = (userInfo) => {
        CacheTool.save(CacheKey.userInfo, JSON.stringify(userInfo))
    }

    openPhotoLibrary = () => {
        ImagePicker.openPicker({
            multiple: false,
            width: 400,
            height: 400,
            cropping: false,
            mediaType: "photo",
        }).then(image => {
            if (image && image.path) {
                const {filename, path} = image
                this.updateAvatar(filename, path)
            }
        });
    }

    openCamera = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: false,
        }).then(image => {
            if (image && image.path) {
                const {filename, path} = image
                this.updateAvatar(filename, path)
            }
        });
    }

    render() {
        return(
            <ContainerView>
                <ScrollView style={{flex: 1, backgroundColor: Colors.lightWhite,}}>
                    {this.renderImageWall()}
                    {this.renderUserInfoHeader()}
                    {this.renderTimelinePage()}
                </ScrollView>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Which one do you like ?'}
                    options={['Photo Library', 'Take Photo', 'cancel']}
                    cancelButtonIndex={2}
                    onPress={this.onClickActionSheet}
                />
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
