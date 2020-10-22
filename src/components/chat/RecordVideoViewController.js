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
import {ScreenDimensions} from '../../utils/Dimemsions';
import {PLATFORM} from '../../utils/Enums';
import MovToMp4 from 'react-native-mov-to-mp4';
import Video from 'react-native-video';

const MaxDurationSecond = 15
const DurationSecondStep = 10
const step = (360/15/10.0)

export default class takeVideoViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            filePath: '',
            isPreview: true
        }

        this.isRecording = false
    }

    componentDidMount() {
        setInterval(() => {
            const {progress} = this.state

            if (this.isRecording) {
                if (progress > (MaxDurationSecond * DurationSecondStep - 1)) {
                    this.stopRecord().then().catch()
                    return
                }

                this.updateRecordProgress(progress + 1)
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
                        const filename = Date.now().toString();
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
        const {progress} = this.state
        let endAngle = progress*step

        return(
            <View style={{
                width: containerSize,
                height: containerSize,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20
            }}>
                <TouchableWithoutFeedback onPress={() => {
                    console.log('onPress')
                    this.updateRecordProgress(0)
                }} onLongPress={() => {
                    console.log('on long press')
                    this.setState({progress: 0})
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
        this.setState({progress: progress})
    }

    renderVideoPreview() {
        let filePath = 'file:///var/mobile/Containers/Data/Application/629FA5CB-9199-4D27-9BC3-39115B9B2A1E/Documents/1603355844637.mp4'
        // const {filePath} = this.state
        // console.log('play uri: ' + filePath )
        return (
            <Video source={{uri: filePath}}
                   ref={(ref) => {
                       this.player = ref
                   }}
                   resizeMode={'cover'}
                   repeat={false}
                   onBuffer={() => {

                   }}
                   onError={(error) => {
                       console.log(error)
                   }}
                   style={{flex: 1}} />
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
                {this.renderTakeButton()}
            </RNCamera>
        )
    }

    renderSeekButton() {
        return(
            <TouchableOpacity onPress={() => {
                this.player && this.player.seek(3)
            }} style={{width: 50, height: 50, backgroundColor: Colors.green,
                position: 'absolute'
            }}>

            </TouchableOpacity>
        )
    }

    render() {
        const {isPreview} = this.state
        return(
            <View style={{backgroundColor: '#000000', flex: 1}}>
                <SafeAreaView style={{flex: 1}}>
                    {isPreview ? this.renderVideoPreview() : this.renderCamera()}

                    {this.renderSeekButton()}
                </SafeAreaView>
            </View>
        )
    }
}
