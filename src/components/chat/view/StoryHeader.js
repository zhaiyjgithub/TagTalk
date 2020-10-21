import React, {Component, Fragment, PureComponent} from 'react';
import {
    ScrollView,
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import {Colors} from '../../../utils/styles';

export default class StoryHeader extends Component{
    static defaultProps = {
        dataSource: []
    }

    renderStories() {
       const {dataSource} = this.props
        return(
            dataSource.map((item, index) => {
                return(
                    <View key={index} style={{marginLeft: 20}}>
                        <TouchableOpacity style={{borderRadius: 33, borderWidth: 2, borderColor: Colors.blue}}>
                            <Image source={require('../../../source/image/test/Group7.png')} style={{width: 66, height: 66}}/>
                            <View style={{position: 'absolute', right: 2, bottom: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.green}}/>
                        </TouchableOpacity>
                        <Text numberOfline={1} style={{width: 70, marginTop: 4,
                            fontSize: 14, color: Colors.black, textAlign: 'center'
                        }}>{'Annie'}</Text>
                    </View>
                )
            })
        )
    }

    render() {
        return (
            <View style={{width: '100%', marginBottom: 20}}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginVertical: 20}}>
                    <View style={{marginLeft: 20}}>
                        <TouchableOpacity >
                            <Image source={require('../../../source/image/chat/addNewStory.png')} style={{width: 66, height: 66}}/>
                        </TouchableOpacity>
                        <Text numberOfline={1} style={{width: 70, marginTop: 4,
                            fontSize: 14, color: Colors.black, textAlign: 'center'
                        }}>{'Your Story'}</Text>
                    </View>

                    {this.renderStories()}

                    <View style={{width: 20, height: 10}}/>
                </ScrollView>

                <View style={{position: 'absolute', left: 20, right: 20, height: 1, bottom: 0, backgroundColor: Colors.lineColor}}/>
            </View>
        )
    }
}
