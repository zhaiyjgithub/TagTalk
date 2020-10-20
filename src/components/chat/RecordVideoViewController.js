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

export default class RecordVideoViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isRecording: false
        }
    }

    recordVideo = async () => {
        const { isRecording } = this.state;
        if (this.camera && !isRecording) {
            try {
                let recordOptions = {
                    mute: false,
                    maxDuration: 5,
                    quality: RNCamera.Constants.VideoQuality['288p'],
                }
                const promise = this.camera.recordAsync(recordOptions);

                if (promise) {
                    this.setState({ isRecording: true });
                    const data = await promise;
                    console.warn('takeVideo', data);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    stopRecord = async () => {
        await this.camera.stopRecording();
        this.setState({ isRecording: false });
    };

    renderTakeButton() {
        const containerSize = 80
        const outerRadius = 35
        const lineWidth = 10
        return(
            <View style={{
                width: containerSize,
                height: containerSize,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableWithoutFeedback onPress={() => {
                    console.log('onPress')
                }} onLongPress={() => {
                    console.log('on long press')
                }} onPressIn={() => {
                    console.log('on press in')
                }} onPressOut={() => {
                    console.log('on press out')
                }} >
                    <Surface width={'100%'} height={'100%'} style={{backgroundColor: 'yellow',}}>
                        <Wedge
                            outerRadius={outerRadius}
                            innerRadius={innerRadius}
                            startAngle={0}
                            endAngle={360}
                            originX={0}
                            originY={0}
                            fill={Colors.blue} />
                    </Surface>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    // render() {
    //     return(
    //         <View style={{backgroundColor: '#000000', flex: 1}}>
    //             <SafeAreaView style={{flex: 1}}>
    //                 {/*<RNCamera*/}
    //                 {/*    ref={ref => {*/}
    //                 {/*        this.camera = ref;*/}
    //                 {/*    }}*/}
    //                 {/*    style={{*/}
    //                 {/*        flex: 1,*/}
    //                 {/*        flexDirection: 'column-reverse',*/}
    //                 {/*        alignItems: 'center'*/}
    //                 {/*    }}*/}
    //                 {/*    type={'back'}*/}
    //                 {/*    autoFocus={true}*/}
    //                 {/*    ratio={'16:9'}*/}
    //                 {/*    androidCameraPermissionOptions={{*/}
    //                 {/*        title: 'Permission to use camera',*/}
    //                 {/*        message: 'We need your permission to use your camera',*/}
    //                 {/*        buttonPositive: 'Ok',*/}
    //                 {/*        buttonNegative: 'Cancel',*/}
    //                 {/*    }}*/}
    //                 {/*>*/}
    //                 {/*    {this.renderTakeButton()}*/}
    //                 {/*</RNCamera>*/}
    //
    //
    //             </SafeAreaView>
    //         </View>
    //     )
    // }

    render() {
       return(
           <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
               {this.renderTakeButton()}
           </View>
       )
    }
}
