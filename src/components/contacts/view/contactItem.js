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

export default class ContactItem extends Component{
    render() {
        return(
            <TouchableOpacity onPress={() => {

            }} style={{marginHorizontal: 20, height: 78, flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Image style={{width: 46, height: 46, borderRadius: 23, marginRight: 14 }} source={require('../../../source/image/test/Group7.png')}/>
                <Text numberOfLines={1} style={{fontFamily: FontFamily.helvetica, fontSize: 14, color: Colors.black, fontWeight: 'bold'}}>{'Jimmy'}</Text>
                <View style={{position: 'absolute', left: 0, right: 0, height: 1, bottom: 0, backgroundColor: Colors.lineColor}}/>
            </TouchableOpacity>
        )
    }
}
