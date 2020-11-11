import React, {Component} from 'react';
import {Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import Spinner from "react-native-spinkit";
import {Colors} from '../../utils/styles';

export default class LoadingSpinner extends Component{
	static defaultProps = {
		size: 60,
		marginTop: 0,
		color: Colors.black
	}

	static getDerivedStateFromProps(nextProps,prevState){
		return {
			visible: nextProps.visible
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			visible: props.visible,
		}
	}

	render() {
		const {visible} = this.state
		const {color, size} = this.props

		if (!visible) {
			return null
		}

		return(
			<View style={{
				position: 'absolute',
				left: 0,
				top: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0,0,0, 0.20)',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<Spinner isVisible={true} size={size} type={'FadingCircleAlt'} color={color}/>
			</View>
		)
	}
}
