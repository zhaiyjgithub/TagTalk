// model/Post.js
import { Model } from '@nozbe/watermelondb'
import { field, children, lazy, action, date } from '@nozbe/watermelondb/decorators'

export default class Post extends Model {
	static table = 'posts'

	@field('title') title
	@field('body') body
	@field('is_pinned') isPinned

	@date('created_at') createdAt
	@date('updated_at') updatedAt
}
