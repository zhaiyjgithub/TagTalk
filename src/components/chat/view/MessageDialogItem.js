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
import {MessageMediaType} from '../../../utils/Enums';

export default class MessageDialogItem extends Component{
    static defaultProps = {
        info: {}
    }

    render() {
        const {info} = this.props
        const {Name} = info
        return(
            <TouchableOpacity onPress={() => {
                const {didSelectedItem} = this.props
                didSelectedItem && didSelectedItem()
            }} style={{marginHorizontal: 20, marginBottom: 20,}}>
                <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, paddingBottom: 10,}}>
                    <Image style={{width: 66, height: 66, borderRadius: 33, overflow: 'hidden'}} source={require('../../../source/image/test/Group7.png')}/>

                    <View style={{justifyContent: 'center', marginLeft: 13, flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
                            <Text numberOfLines={1} style={{fontFamily: 'Helvetica', fontSize: 17, color: Colors.black}}>{Name}</Text>
                            <Text numberOfLines={1} style={{fontFamily: 'Helvetica', fontSize: 12, color: Colors.gray}}>{'04:00 pm'}</Text>
                        </View>
                        <Text numberOfLines={1} style={{fontFamily: 'Helvetica', fontSize: 14, color: Colors.gray, marginTop: 8}}>{'Sounds cool'}</Text>
                    </View>
                    <View style={{position: 'absolute', left: 0, right: 0, height: 1, bottom: 0, backgroundColor: Colors.lineColor}}/>
                </View>
            </TouchableOpacity>
        )
    }
}
