import React, {Component} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    FlatList,
    View,
    Text,
    RefreshControl,
    TouchableOpacity,
    TextInput,
    Image,
    Animated,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import {Colors} from '../../utils/styles';
import {Surface, Shape, Path,Group} from '@react-native-community/art';
import Wedge from './view/Wedge';
import {PLATFORM} from '../../utils/Enums';
import MovToMp4 from 'react-native-mov-to-mp4';
import Video from 'react-native-video';
import {Navigation} from 'react-native-navigation';

const MaxDurationSecond = 15
const DurationSecondStep = 10
const step = (360/15/10.0)

export default class takeVideoViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            filePath: '',
            isPreview: false,
            progressText: 0,
            isPlaying: true
        }

        this.isRecording = false
        this.progress = 0
    }

    componentDidMount() {
        setInterval(() => {

            if (this.isRecording) {
                if (this.progress > (MaxDurationSecond * DurationSecondStep - 1)) {
                    this.stopRecord().then().catch()
                    return
                }

                this.updateRecordProgress(this.progress + 1)
            }
        }, 100)
    }

    takeVideo = async () => {
        if (this.camera && !this.isRecording) {
            try {
                this.isRecording = true
                let recordOptions = {
                    mute: false,
                    maxDuration: 15,
                    quality: RNCamera.Constants.VideoQuality['288p'],
                }
                const promise = this.camera.recordAsync(recordOptions);

                if (promise) {
                    const data = await promise;
                    this.isRecording = false
                    console.log('takeVideo', data);
                    let uri = data.uri
                    if (PLATFORM.isIOS) {
                        const filename = ('mini_video_' +  Date.now().toString())
                        MovToMp4.convertMovToMp4(uri, filename)
                        .then((path) => {
                            //here you can upload the video...
                            console.log(path);
                            if (path) {
                                this.setState({filePath: "file://" +  path, isPreview: true})


                            }
                        });

                    }
                }else {
                    this.isRecording = false
                }
            } catch (e) {
                this.isRecording  = false
                console.error(e);
            }
        }
    };

    stopRecord = async () => {
        await this.camera.stopRecording();
        this.isRecording = false
        this.updateRecordProgress(0)
    }

    renderTakeButton() {
        const containerSize = 80
        const outerRadius = 40
        const lineSize = 8
        const originX = (containerSize - outerRadius*2)/2.0 + outerRadius
        const originY = (containerSize - outerRadius*2)/2.0
        const progress = this.progress
        let endAngle = progress*step

        return(
            <View style={{
                width: containerSize,
                height: containerSize,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TouchableWithoutFeedback onPress={() => {
                    console.log('onPress')
                    this.updateRecordProgress(0)
                }} onLongPress={() => {
                    console.log('on long press')
                    this.progress = 0
                    this.takeVideo().then().catch()
                }} onPressIn={() => {
                    console.log('on press in ')
                }} onPressOut={() => {
                    console.log("current progress: " + progress)
                    this.stopRecord().then().catch()
                    console.log('on press out')
                }} >
                    <View style={{width: containerSize, height: containerSize, borderRadius: containerSize/2.0, backgroundColor: Colors.gray}}>
                        <View style={{position: 'absolute', width: containerSize - lineSize*2, height: containerSize - lineSize*2,
                            top: lineSize, left: lineSize, backgroundColor: Colors.white, borderRadius: ( containerSize - lineSize*2)/2.0
                        }}/>
                        <Surface width={'100%'} height={'100%'} style={{backgroundColor: 'rgba(0,0,0,0)',}}>
                            <Wedge
                                outerRadius={outerRadius}
                                innerRadius={outerRadius - lineSize}
                                startAngle={0}
                                endAngle={endAngle}
                                originX={originX}
                                originY={originY}
                                fill={Colors.lightGreen} />
                        </Surface>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    updateRecordProgress(progress) {
        this.progress = progress
        this.setState({progressText: progress})
    }

    renderVideo() {
        // let filePath = 'file:///var/mobile/Containers/Data/Application/629FA5CB-9199-4D27-9BC3-39115B9B2A1E/Documents/1603355844637.mp4'
        const {filePath, isPlaying} = this.state
        // console.log('play uri: ' + filePath )
        return (
            <Video source={{uri: filePath}}
                   ref={(ref) => {
                       this.player = ref
                   }}
                   resizeMode={'cover'}
                   repeat={false}
                   paused={!isPlaying}
                   onBuffer={() => {

                   }}
                   onLoad={() => {
                       this.setState({isPlaying: true})
                   }}
                   onEnd={() => {
                       this.setState({isPlaying: false})
                   }}
                   onError={(error) => {
                       console.log(error)
                       this.setState({isPlaying: false})
                   }}
                   style={{flex: 1,}} />
        )
    }

    renderVideoPreview() {
        return(
            <View style={{flex: 1, backgroundColor: '#000000'}}>
                {this.renderVideo()}
                <View style={{position: 'absolute', right: 0, left: 0, bottom: 0,
                    paddingBottom: 15
                }}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between', paddingHorizontal: 20,
                        marginTop: 20
                    }}>
                        {this.renderCancelVideoButton()}
                        <TouchableOpacity style={{width: 50, height: 50,
                            justifyContent: 'center', alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0, 0.35)', borderRadius: 25,
                        }}>
                            <Image  source={require('../../source/image/chat/play.png')} style={{
                                tintColor: Colors.white, width: 30, height: 30,
                            }}/>
                        </TouchableOpacity>
                        {this.renderDoneButton()}
                    </View>
                </View>
            </View>
        )
    }

    renderCancelVideoButton() {
        return(
            <TouchableOpacity onPress={() => {
                Navigation.pop(this.props.componentId)
            }} style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
                backgroundColor: 'rgba(0,0,0, 0.35)', borderRadius: 20,
            }}>
                <Image style={{tintColor: Colors.white,}} source={require('../../source/image/chat/close_circle.png')} />
            </TouchableOpacity>
        )
    }

    renderDoneButton() {
        return(
            <TouchableOpacity onPress={() => {
                this.popToLastPage()
            }} style={{width: 40, height: 30, backgroundColor: Colors.green, justifyContent: 'center',
                alignItems: 'center', borderRadius: 2,
            }}>
                <Image style={{tintColor:  Colors.white}} source={require('../../source/image/chat/done.png')}/>
            </TouchableOpacity>
        )
    }

    renderCamera() {
        return(
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{
                    flex: 1,
                    flexDirection: 'column-reverse',
                    alignItems: 'center'
                }}
                type={'back'}
                autoFocus={true}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            >
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', paddingHorizontal: 20,
                    marginBottom: 20,
                }}>
                    {this.renderPopButton()}
                    {this.renderTakeButton()}
                    <View />
                </View>
            </RNCamera>
        )
    }

    renderPopButton() {
        return(
            <TouchableOpacity onPress={() => {
                this.popToLastPage()
            }} style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
                backgroundColor: 'rgba(0,0,0, 0.35)', borderRadius: 20,
            }}>
                <Image style={{tintColor: Colors.white,}} source={require('../../source/image/chat/down_circle.png')} />
            </TouchableOpacity>
        )
    }

    popToLastPage() {
        if (PLATFORM.isIOS) {
            Navigation.dismissModal(this.props.componentId)
        }else {
            Navigation.pop(this.props.componentId)
        }
    }

    deleteFile() {

    }

    render() {
        const {isPreview} = this.state
        return(
            <View style={{backgroundColor: '#000000', flex: 1}}>
                <SafeAreaView style={{flex: 1}}>
                    {isPreview ? this.renderVideoPreview() : this.renderCamera()}
                </SafeAreaView>
            </View>
        )
    }
}
