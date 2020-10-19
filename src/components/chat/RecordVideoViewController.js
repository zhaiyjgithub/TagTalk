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
    Keyboard
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import {Colors} from '../../utils/styles';

export default class RecordVideoViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isRecording: false
        }
    }

    takeVideo = async () => {
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

    stopVideo = async () => {
        await this.camera.stopRecording();
        this.setState({ isRecording: false });
    };

    renderTakeButton() {
        return(
            <TouchableOpacity style={{
                width: 80,
                height: 80,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{fontSize: 18, color: Colors.white, alignSelf: 'center'}}>{'Take'}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return(
            <View style={{backgroundColor: '#000000', flex: 1}}>
                <SafeAreaView style={{flex: 1}}>
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
                        ratio={'16:9'}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    >
                        {this.renderTakeButton()}
                    </RNCamera>
                </SafeAreaView>
            </View>
        )
    }
}
