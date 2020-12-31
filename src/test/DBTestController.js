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
	Keyboard,
	TouchableWithoutFeedback,
} from 'react-native';
import {Database, Q} from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import {mySchema} from '../database/schema';
import Post from '../database/Post';

const adapter = new SQLiteAdapter({
	dbName: 'WatermelonDemo',
	schema: mySchema,
})

const database = new Database({
	adapter,
	modelClasses: [Post],
	actionsEnabled: true,
})

export default class DBTestController extends Component{
	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		const postsCollection = database.collections.get('posts')
		const allPosts = await postsCollection.query().fetch()
		// console.log(allPosts.length)
		for (let i = 0; i < allPosts.length; i ++) {
			console.log(allPosts[i])
		}
	}

	async createNewObject() {
		await database.action(async () => {
			const postsCollection = database.collections.get('posts')
			const newPost = await postsCollection.create(post => {
				post.title = 'New post'
				post.body = 'Lorem ipsum...'
			})
		})
	}

	async queryObject() {
		const postsCollection = database.collections.get('posts')
		let records = await postsCollection.query(Q.where("is_pinned", false))
		debugger
		console.log('\r\nrecords: === \r\n' + (records.length))
		let item: Post = records[0]
		console.log(item.title)
	}

	render() {
		return(
			<SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<TouchableOpacity onPress={() => {
					this.createNewObject()
				}}>
					<Text>{'Create'}</Text>
				</TouchableOpacity>

				<TouchableOpacity style={{marginVertical: 50}} onPress={() => {
					this.queryObject()
				}}>
					<Text>{'Query'}</Text>
				</TouchableOpacity>
			</SafeAreaView>
		)
	}
}
