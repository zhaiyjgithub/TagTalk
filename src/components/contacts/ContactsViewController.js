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
import {Navigation} from 'react-native-navigation';
import ContactItem from './view/contactItem';
import {Colors, FontFamily} from '../../utils/styles';

export default class ContactsViewController extends Component{
    constructor(props) {
        super(props)
        this.state = {

        }


    }

    componentDidMount() {

    }

    pushToChatRoom() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'ChatViewController',
                passProps: {
                    uid: 98
                },
                options: {
                    topBar: {
                        title: {
                            text: 'Jimmy'
                        }
                    },
                }

            }
        });
    }

    renderItem() {
        return(
            <ContactItem />
        )
    }

    renderSearchBar() {
        return (
            <View style={{flex: 1, height: 40, marginVertical: 20,
                flexDirection: 'row', alignItems: 'center', marginHorizontal: 20,
                backgroundColor: Colors.searchBar, borderRadius: 20,
            }}>
                <Image source={require('../../source/image/chat/search.png')} style={{width: 18, height: 18, marginLeft: 16, marginRight: 5 }}/>
                <TextInput
                    placeholder={'Search'}
                    placeholderColor={Colors.placeholder}
                    style={{
                        flex: 1,
                        paddingVertical: 0, paddingHorizontal: 5,
                        fontSize: 15, color: Colors.black,
                        marginRight: 10, height: 40, fontFamily: FontFamily.helvetica
                    }}/>
            </View>
        )
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <FlatList
                    style={{flex: 1}}
                    data={[1, 2, 3]}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item, index) => {
                        return 'key' + item.key + index
                    }}
                    ListHeaderComponent={() => {
                        return(
                            this.renderSearchBar()
                        )
                    }}
                />
            </View>
        )
    }
}
