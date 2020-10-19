import React, {Component, Fragment, PureComponent} from 'react';
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
		this.state = {
			isPeer: props.isPeer,
			message: props.message
		}
	}

	componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
		this.setState({message: nextProps.message, isPeer: nextProps.isPeer})
	}

	shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
		return this.state.message.text !== nextProps.message.text
	}

	renderUserIcon(isPeer) {
		return(
			<View style={{width: 34, height: 34, borderRadius: 17, marginRight: isPeer ? 4 : 0, marginLeft: isPeer ? 0 : 4}}>
				<Image source={require('../../../source/image/test/Group7.png')} style={{width: 34, height: 34, overflow: 'hidden'}}/>
				{isPeer ? <View style={{position: 'absolute', right: 2, bottom: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green}}/> : null}
			</View>
		)
	}

	renderTextMessage(isPeer) {
		const {message} = this.state
		return (
			<View style={[{flex: 1, maxWidth: '65%',
				backgroundColor: isPeer ? Colors.lightBlue : Colors.blue,
				minHeight: 40,
				paddingVertical: 8, paddingHorizontal: 15
			}, isPeer ? styles.peerTextContainer : styles.myTextContainer]}>
				<Text style={{
					fontSize: 16,
					color: isPeer ? Colors.black : Colors.white,
					fontFamily: FontFamily.helvetica
				}}>{message.text}</Text>
			</View>

		)
	}

	render() {
		const {isPeer} = this.state
		return(
			<View style={isPeer ? styles.peerContainer : styles.myContainer}>
				<Fragment>
					{this.renderUserIcon(isPeer)}
					{this.renderTextMessage(isPeer)}
				</Fragment>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	peerContainer: {
		marginHorizontal: 22,
		flexDirection: 'row',
		marginBottom: 20
	},
	myContainer: {
		marginHorizontal: 22,
		flexDirection: 'row-reverse',
		marginBottom: 20
	},
	peerTextContainer: {
		borderTopLeftRadius: 4,
		borderTopRightRadius: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	myTextContainer: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 4,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
})
