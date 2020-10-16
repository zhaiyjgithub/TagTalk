import React, {Component, Fragment} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	FlatList,
	View,
	Text,
	ImageBackground,
	Image
} from 'react-native';
import {Colors, FontFamily} from '../../../utils/styles';

export default class ChatItem extends Component{
	constructor(props){
		super(props)
	}

	renderUserIcon(isPeer) {
		return(
			<View style={{width: 34, height: 34, borderRadius: 17, marginRight: isPeer ? 4 : 0, marginLeft: isPeer ? 0 : 4}}>
				<Image source={require('../../../source/image/test/Group7.png')} style={{width: 34, height: 34, overflow: 'hidden'}}/>
				<View style={{position: 'absolute', right: 2, bottom: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green}}/>
			</View>
		)
	}

	renderTextMessage() {
		return (
			<View style={{flex: 1, maxWidth: '65%', backgroundColor: Colors.lightBlue, minHeight: 40,
				borderTopLeftRadius: 4, borderTopRightRadius: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
				paddingVertical: 8, paddingHorizontal: 13
			}}>
				<Text style={{
					fontSize: 15,
					color: Colors.black,
					fontFamily: FontFamily.helvetica
				}}>{'Trademarks and brands are the property of their respective owners.'}</Text>
			</View>

		)
	}

	render() {
		let isPeer = false
		return(
			<View style={{marginHorizontal: 22, flexDirection: 'row', marginBottom: 20}}>
				{isPeer ?
					<Fragment>
						{this.renderUserIcon(isPeer)}
						{this.renderTextMessage()}
					</Fragment> :
					<Fragment>
						{this.renderTextMessage()}
						{this.renderUserIcon(isPeer)}
					</Fragment>
				}

			</View>
		)
	}
}
