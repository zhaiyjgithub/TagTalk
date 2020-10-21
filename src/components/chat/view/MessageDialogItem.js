import React, {Component, Fragment, PureComponent} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import {Colors, FontFamily} from '../../../utils/styles';
import FastImage from 'react-native-fast-image'
import {ScreenDimensions} from '../../../utils/Dimemsions';
import {MessageType} from '../../../utils/Enums';

export default class MessageDialogItem extends Component{
    render() {
        return(
            <TouchableOpacity onPress={() => {
                this.pushToChatRoom()
            }} style={{marginHorizontal: 20, paddingBottom: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                    <Image style={{width: 66, height: 66, borderRadius: 33, overflow: 'hidden'}} source={require('../../../source/image/test/Group7.png')}/>

                    <View style={{justifyContent: 'center', marginLeft: 13, flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
                            <Text numberOfLines={1} style={{fontFamily: 'Helvetica', fontSize: 17, color: Colors.black}}>{'Jimmy'}</Text>
                            <Text numberOfLines={1} style={{fontFamily: 'Helvetica', fontSize: 12, color: Colors.gray}}>{'04:00 pm'}</Text>
                        </View>
                        <Text numberOfLines={1} style={{fontFamily: 'Helvetica', fontSize: 14, color: Colors.gray, marginTop: 8}}>{'Sounds cool'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
