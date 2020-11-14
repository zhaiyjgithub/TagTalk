
const CacheTool = {
	load: (key, cb, error) => {
		global.storage.load({
			key: key,
			autoSync: true,
			syncInBackground: true,
		}).then(response => {
			cb && cb(response)
		}).catch((err) => {
			error && error(err)
		})
	},
	save:(key, obj) => {
		global.storage.save({
			key: key,
			data: obj
		})
	},
	remove: (key) => {
		global.storage.remove({
			key: key
		})
	}
}

export default CacheTool
