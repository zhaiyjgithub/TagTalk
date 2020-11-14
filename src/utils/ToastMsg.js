import {WToast, WSnackBar} from 'react-native-smart-tip'

const ToastMsg = {
	show(message, duration = WToast.duration.SHORT, position = WToast.position.CENTER){
		const toastOpts = {
			data: message,
			duration: duration, //1.SHORT 2.LONG
			position: position, // 1.TOP 2.CENTER 3.BOTTOM
		}

		WToast.show(toastOpts)
	},
	showSnackbar() {
		const snackBarOpts = {
			data: 'Please check the network first.',
			position: WSnackBar.position.BOTTOM, // 1.TOP 2.CENTER 3.BOTTOM
			duration: WSnackBar.duration.LONG, //1.SHORT 2.LONG 3.INDEFINITE
			textColor: '#ff490b',
			backgroundColor: '#050405',
			actionText: 'Sure',
			actionTextColor: '#ff490b',
			onActionHide: (isSlideHide)=>{
				// Click Action
			},
		}

		WSnackBar.show(snackBarOpts)
	}
}

export default ToastMsg


