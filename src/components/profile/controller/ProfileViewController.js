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
    TextInput
} from 'react-native';
import CacheTool from '../../../utils/CacheTool';
import {CacheKey} from '../../../utils/Enums';
import {Router} from '../../../route/router';

export default class ProfileViewController extends Component{
    render() {
        return(
            <SafeAreaView style={{flex: 1}}>
                <TouchableOpacity onPress={() => {
                    CacheTool.remove(CacheKey.userInfo)
                    Router.showGuide()
                }}>
                    <Text>{'Sign out'}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}
