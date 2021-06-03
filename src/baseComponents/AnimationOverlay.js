import React, { Component } from "react";
import { Animated, TouchableWithoutFeedback, Dimensions } from "react-native";
import { Navigation } from "react-native-navigation";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableWithoutFeedback);
const deviceHeight = Dimensions.get("window").height;
const ANIM_DURATION = 100;

export default class AnimationOverlay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			opacityBgAnim: new Animated.Value(0),
			opacityContentAnim: new Animated.Value(0),
			contentSlideAnim: new Animated.Value(deviceHeight / 4)
		};
	}

	componentDidMount() {
		Animated.parallel([
			Animated.timing(this.state.opacityBgAnim, {
				toValue: 1,
				duration: ANIM_DURATION,
				useNativeDriver: true
			}),
			Animated.timing(this.state.contentSlideAnim, {
				toValue: 0,
				duration: ANIM_DURATION,
				useNativeDriver: true
			}),
			Animated.timing(this.state.opacityContentAnim, {
				toValue: 1,
				duration: ANIM_DURATION,
				delay: ANIM_DURATION / 2,
				useNativeDriver: true
			})
		]).start();
	}

	_dismissOverlay = () => {
		Animated.timing(this.state.opacityBgAnim, {
			toValue: 0,
			duration: ANIM_DURATION,
			useNativeDriver: true
		}).start(() => {
			Navigation.dismissOverlay(this.props.componentId);
		});
	};

	render() {
		return (
			<TouchableWithoutFeedback onPress={this._dismissOverlay} style={{ flex: 1 }}>
				<Animated.View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#00000088",
						opacity: this.state.opacityBgAnim
					}}>
					<AnimatedTouchable
						onPress={() => {}}
						style={{
							opacity: this.state.opacityContentAnim,
							transform: [{ translateY: this.state.contentSlideAnim }]
						}}>
						{this.props.children}
					</AnimatedTouchable>
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}
