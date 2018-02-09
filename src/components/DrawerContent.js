import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import { logout } from '../redux/actions';
import UserIcon from '../assets/user.png';
import { getLoggedInUser } from '../redux/selectors';


const mapStateToProps = state => ({
	user: getLoggedInUser(state)
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

class DrawerContent extends React.Component {

	render() {
		return (
			<View style={styles.container}>
				<View>
					{
						this.props.user &&
						<View style={styles.userDetails}>
							<View style={{flexDirection:'row', flexWrap:'wrap'}}>
								<Image source={UserIcon} style={{marginRight: 15}}/>
								<View style={{paddingTop: 3}}>
									<Text style={{fontWeight: 'bold', color: '#333'}}>{this.props.user.username}</Text>
									<Text style={{color: '#333'}}>{this.props.user.email}</Text>
								</View>
							</View>
							<View style={{marginTop: 12}}>
								<Text>My Credit: <Text style={{fontWeight: 'bold'}}>{this.props.user.credit}</Text></Text>
							</View>
						</View>
					}
					<View style={{marginLeft: 20, marginRight: 20}}>
						<TouchableOpacity style={styles.navButton} onPress={() => Actions.home()}>
							<Text>My Groups</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.logoutButtonWrapper}>
					<TouchableOpacity onPress={this.props.logout} style={styles.logoutButton}>
						<Text style={{color: '#FFF', textAlign: 'center'}}>Log out</Text>
					</TouchableOpacity>
				</View>
			</View >
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
        justifyContent: 'space-between'
	},
	userDetails: {
		backgroundColor: '#EEEEEE',
		paddingTop: 25,
		paddingBottom: 25,
		paddingLeft: 20
	},
	navButton: {
		borderBottomColor: '#DDD',
		borderBottomWidth: 1,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 10
	},
	logoutButtonWrapper: {
		marginLeft: 20,
		marginRight: 20,
		marginBottom: 25
	},
	logoutButton: {
		paddingTop: 15,
		paddingBottom: 15,
		backgroundColor: Config.DEFAULT_COLOR || '#494e6b'
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
