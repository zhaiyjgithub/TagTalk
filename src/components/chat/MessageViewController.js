import React, {Component} from 'react';
import {
	SafeAreaView,
	StyleSheet,
	FlatList,
	View,
	Text,
	RefreshControl,
	TouchableOpacity
} from 'react-native';

let ws = new WebSocket("ws://localhost:8088/ws?uid=3378")

export default class MessageViewController extends Component{
	constructor(props) {
		super(props)
		this.state = {
			msg: ''
		}
	}
	componentDidMount() {
		this.initWebsocket()
	}

	initWebsocket() {
		ws.onopen = () => {
			// connection opened
			console.log('Connection opened')
			ws.send('something'); // send a message
		};

		ws.onmessage = (e) => {
			// a message was received
			console.log(e.data);
			this.setState({msg: e.data})
		};

		ws.onerror = (e) => {
			// an error occurred
			console.log(e.message);
		};

		ws.onclose = (e) => {
			// connection closed
			console.log(e.code, e.reason);
		};
	}

	render() {
		const {msg} = this.state
		return(
			<View style={{flex: 1}}>
				<TouchableOpacity onPress={() => {
					let msg = (new Date()).toISOString()
					ws.send(msg)
				}} style={{height: 60, width: 100, backgroundColor: 'red'}}>
					<Text>{'Send'}</Text>
				</TouchableOpacity>

				<Text>{msg}</Text>
			</View>
		)
	}
}
