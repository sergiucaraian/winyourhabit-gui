import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, Image, Picker, TextInput } from 'react-native';
import { Card, Divider, List, ListItem, FormInput, Button as ButtonElement } from 'react-native-elements';
import Modal from "react-native-modal";
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import { logout, addGroupRequest } from '../redux/actions';
import UserIcon from '../assets/user.png';
import { getLoggedInUser } from '../redux/selectors';


const mapStateToProps = state => ({
	user: getLoggedInUser(state)
});

const mapDispatchToProps = dispatch => ({
	logout: () => dispatch(logout()),
	addGroup: (title, description, timeframe, proofType) => dispatch(addGroupRequest(title, description, timeframe, proofType))
});

class DrawerContent extends React.Component {

	constructor(props)
	{
		super(props);

		this.state = {
			addGroupModalVisible: false,
			addGroupTitle: '',
			addGroupDescription: '',
			addGroupTimeframe: '1',
			addGroupProofType: 'image'
		};

		this.toggleCreateGroupModal = this.toggleCreateGroupModal.bind(this);
		this.onChangeAddGroupTitle = this.onChangeAddGroupTitle.bind(this);
        this.onChangeAddGroupDescription = this.onChangeAddGroupDescription.bind(this);
		this.onChangeAddCommitmentTimeframe = this.onChangeAddCommitmentTimeframe.bind(this);
		this.onChangeAddCommitmentProofType = this.onChangeAddCommitmentProofType.bind(this);
		this.addGroup = this.addGroup.bind(this);
	}

	toggleCreateGroupModal()
	{
		if(this.state.addGroupModalVisible)
        {
            this.setState({
                addGroupModalVisible: false
            });
        }
        else
        {
            this.setState({
				addGroupModalVisible: true,
				addGroupTitle: '',
				addGroupDescription: '',
				addGroupTimeframe: '1',
				addGroupProofType: 'image'
            });
        }
	}

	onChangeAddGroupTitle(value)
    {
        this.setState({
            addGroupTitle: value
        });
    }

    onChangeAddGroupDescription(value)
    {
        this.setState({
            addGroupDescription: value
        });
    }

    onChangeAddCommitmentTimeframe(value)
    {
        this.setState({
            addGroupTimeframe: value
        });
	}

	onChangeAddCommitmentProofType(value)
    {
        this.setState({
            addGroupProofType: value
        });
	}

	addGroup()
	{
		this.props.addGroup(this.state.addGroupTitle, this.state.addGroupDescription, this.state.addGroupTimeframe, this.state.addGroupProofType);
		this.toggleCreateGroupModal();
	}

	render() {
		return (
			<View style={styles.container}>
				<Modal isVisible={this.state.addGroupModalVisible}>
                    <View style={styles.modalContent}>
                        <View>
                            <FormInput value={this.state.addGroupTitle} onChangeText={this.onChangeAddGroupTitle} placeholder="Title" />
							<FormInput value={this.state.addGroupDescription} onChangeText={this.onChangeAddGroupDescription} placeholder="Description" />
							<FormInput value={this.state.addGroupTimeframe} onChangeText={this.onChangeAddCommitmentTimeframe} keyboardType="numeric" placeholder="Commitment timeframe" />
							<Picker
								selectedValue={this.state.addGroupProofType}
								onValueChange={this.onChangeAddCommitmentProofType}>
								<Picker.Item label="Text" value="text" />
								<Picker.Item label="Image" value="image" />
							</Picker>
                        </View>
                        <View style={styles.modalControlsWrapper}>
                            <TouchableOpacity style={styles.buttonCancelCreateGroupModal} onPress={this.toggleCreateGroupModal}>
                                <Text style={styles.buttonCreateGroupText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonCreateGroupModal} onPress={this.addGroup}>
                                <Text style={styles.buttonCreateGroupText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
				<View>
					<View style={styles.createGroupButtonWrapper}>
						<TouchableOpacity onPress={() => this.toggleCreateGroupModal()} style={styles.createGroupButton}>
							<Text style={{color: '#FFF', textAlign: 'center'}}>Create group</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.logoutButtonWrapper}>
						<TouchableOpacity onPress={this.props.logout} style={styles.logoutButton}>
							<Text style={{color: '#FFF', textAlign: 'center'}}>Log out</Text>
						</TouchableOpacity>
					</View>
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
	createGroupButtonWrapper:
	{
		marginBottom: 10,
		marginRight: 20,
		marginLeft: 20
	},
	logoutButtonWrapper: {
		marginLeft: 20,
		marginRight: 20,
		marginBottom: 25
	},
	logoutButton: {
		paddingTop: 15,
		paddingBottom: 15,
		backgroundColor: '#dc3545'
	},
	createGroupButton: {
		paddingTop: 15,
		paddingBottom: 15,
		backgroundColor: Config.DEFAULT_COLOR || '#494e6b'
	},
	modalContent: {
        backgroundColor: '#FFF', 
        paddingTop: 20, 
        paddingBottom: 20, 
        paddingLeft: 30, 
        paddingRight: 30,
        borderRadius: 5
	},
	buttonCancelCreateGroupModal: {
		backgroundColor: Config.DEFAULT_COLOR || '#dc3545',
        borderRadius: 5,
        width: 120
	},
	buttonCreateGroupModal: {
		backgroundColor: Config.DEFAULT_COLOR || '#28a745',
        borderRadius: 5,
        width: 120
	},
	modalControlsWrapper: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop: 25
	},
	buttonCreateGroupText: {
		paddingTop: 10,
        paddingBottom: 10,
        color: '#FFF',
        textAlign: 'center'
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
