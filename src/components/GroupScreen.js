import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, StyleSheet, ScrollView, RefreshControl, Image, TouchableOpacity, Button } from 'react-native';
import Modal from "react-native-modal";
import moment from 'moment';
import { Card, Divider, List, ListItem, FormInput, Button as ButtonElement } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker'
import Config from 'react-native-config';
import { ImagePicker } from 'expo';
import { addUserToGroupRequest, fetchGroupActiveObjectivesRequest, fetchGroupObjectivesToVoteRequest, sendTextProofRequest, sendPhotoProofRequest, addCommitmentRequest, sendVoteRequest, fetchGroupsRequest } from '../redux/actions';
import { makeGetGroupUsers, makeGetMyActiveObjectives, makeGetOtherUsersActiveObjectives, makeGetObjectivesToVote } from '../redux/selectors';

const makeMapStateToProps = (state, ownProps) =>
{
    const getGroupUsers = makeGetGroupUsers({
        groupID: ownProps.group.id
    });

    const getMyActiveObjectives = makeGetMyActiveObjectives({
        groupID: ownProps.group.id
    });

    const getOtherUsersActiveObjectives = makeGetOtherUsersActiveObjectives({
        groupID: ownProps.group.id
    });

    const getObjectivesToVote = makeGetObjectivesToVote({
        groupID: ownProps.group.id
    });

    return {
        users: getGroupUsers(state),
        myActiveObjectives: getMyActiveObjectives(state),
        otherUsersActiveObjectives: getOtherUsersActiveObjectives(state), 
        objectivesToVote: getObjectivesToVote(state)
    };
};


const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchGroups: () => dispatch(fetchGroupsRequest()),
    fetchGroupActiveObjectives: () => dispatch(fetchGroupActiveObjectivesRequest(ownProps.group.id)),
    fetchGroupObjectivesToVote: () => dispatch(fetchGroupObjectivesToVoteRequest(ownProps.group.id)),
    sendTextProof: (objectiveID, proofValue) => dispatch(sendTextProofRequest(ownProps.group.id, objectiveID, proofValue)),
    sendPhotoProof: (objectiveID, photoURI) => dispatch(sendPhotoProofRequest(ownProps.group.id, objectiveID, photoURI)),
    addCommitment: (description, date, bet) => dispatch(addCommitmentRequest(ownProps.group.id, description, moment(date).format('YYYY-MM-DDT00:00'), bet)),
    addUser: (userID) => dispatch(addUserToGroupRequest(userID, ownProps.group.id)),
    sendVote: (objectiveID, value) => dispatch(sendVoteRequest(ownProps.group.id, objectiveID, value))
});

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const formatDate = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = date.getUTCDay();
    const month = date.getUTCMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[month]} ${year}`;
}

class GroupScreen extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            refreshing: false,
            objectiveProofInput: {},
            addTextProofModalVisible: false,
            addTextProofModalObjectiveID: null,
            currentPhotoObjectiveID: null,
            addTextProofInputValue: '',
            addCommitmentDescriptionValue: '',
            addCommitmentDateValue: moment().format('YYYY-MM-DD'),
            addCommitmentBetValue: '',
            addUserModalVisible: false,
            addUserModalUserID: ''
        };

        this.toggleAddTextProofModal = this.toggleAddTextProofModal.bind(this);
        this.toggleAddCommitmentModal = this.toggleAddCommitmentModal.bind(this);
        this.toggleAddUserModal = this.toggleAddUserModal.bind(this);
        this.takePhotoProof = this.takePhotoProof.bind(this);
        this.onChangeAddTextProofInput = this.onChangeAddTextProofInput.bind(this);
        this.onChangeAddCommitmentDescription = this.onChangeAddCommitmentDescription.bind(this);
        this.onChangeAddCommitmentDate = this.onChangeAddCommitmentDate.bind(this);
        this.onChangeAddCommitmentBet = this.onChangeAddCommitmentBet.bind(this);
        this.onChangeAddUserInput = this.onChangeAddUserInput.bind(this);
        this.sendTextProof = this.sendTextProof.bind(this);
        this.addCommitment = this.addCommitment.bind(this);
        this.addUser = this.addUser.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    async onRefresh()
    {
        this.setState({refreshing: true});
        await this.fetch()
        this.setState({refreshing: false});
    }

    componentDidMount()
    {
        this.fetch();
    }

    async fetch()
    {
        await Promise.all([
            this.props.fetchGroups(),
            this.props.fetchGroupActiveObjectives(),
            this.props.fetchGroupObjectivesToVote()
        ]);
    }

    getUser(userID)
    {
        let user = null;

        this.props.users.forEach((crtUser) => {
            if(crtUser.id === userID)
                user = crtUser;
        });

        return user;
    }

    toggleAddTextProofModal(objectiveID=null)
    {
        if(this.state.addTextProofModalVisible)
        {
            this.setState({
                addTextProofModalVisible: false,
                addTextProofModalObjectiveID: null,
                addTextProofInputValue: ''
            });
        }
        else
        {
            this.setState({
                addTextProofModalVisible: true,
                addTextProofModalObjectiveID: objectiveID
            });
        }
    }

    toggleAddCommitmentModal()
    {
        if(this.state.addCommitmentModalVisible)
        {
            this.setState({
                addCommitmentModalVisible: false
            });
        }
        else
        {
            this.setState({
                addCommitmentModalVisible: true,
                addCommitmentDescriptionValue: '',
                addCommitmentDateValue: moment().format('YYYY-MM-DD'),
                addCommitmentBetValue: ''
            });
        }
    }

    toggleAddUserModal()
    {
        if(this.state.addUserModalVisible)
        {
            this.setState({
                addUserModalVisible: false
            });
        }
        else
        {
            this.setState({
                addUserModalVisible: true,
                addUserModalUserID: '',
            });
        }
    }

    onChangeAddCommitmentDescription(value)
    {
        this.setState({
            addCommitmentDescriptionValue: value
        });
    }

    onChangeAddCommitmentDate(value)
    {
        this.setState({
            addCommitmentDateValue: value
        });
    }

    onChangeAddCommitmentBet(value)
    {
        this.setState({
            addCommitmentBetValue: value
        });
    }

    onChangeAddUserInput(value)
    {
        this.setState({
            addUserModalUserID: value
        });
    }

    async takePhotoProof(objectiveID)
    {
        this.setState({ currentPhotoObjectiveID: objectiveID });
        const photoResult = await ImagePicker.launchCameraAsync();
        
        if(!photoResult.cancelled)
        {
            this.props.sendPhotoProof(this.state.currentPhotoObjectiveID, photoResult.uri);
        }
    }

    onChangeAddTextProofInput(value)
    {
        this.setState({
            addTextProofInputValue: value
        });
    }

    sendTextProof()
    {
        this.props.sendTextProof(this.state.addTextProofModalObjectiveID, this.state.addTextProofInputValue);
        this.toggleAddTextProofModal();
    }

    addCommitment()
    {
        this.props.addCommitment(this.state.addCommitmentDescriptionValue, this.state.addCommitmentDateValue, this.state.addCommitmentBetValue);
        this.toggleAddCommitmentModal();
    }

    addUser()
    {
        this.props.addUser(this.state.addUserModalUserID);
        this.toggleAddUserModal();
    }

    render()
    {
        const rowsMyObjectives = this.props.myActiveObjectives.map(objective => (
            <ListItem key={objective.id} hideChevron={true} subtitle={
                <View style={styles.objectiveContents}>
                    <Text><Text style={styles.description}>Description: </Text><Text>{objective.description}</Text></Text>
                    <Text><Text style={styles.bet}>Bet: </Text><Text>{`${objective.bet_value} ${objective.bet_value === 1 ? 'coin' : 'coins'}`}</Text></Text>
                    {
                        this.props.group.time_frame > 1 ?
                        <Text><Text style={styles.dateLabel}>Date: </Text><Text>{moment(objective.start_date).format('DD MMMM YYYY')}</Text> - <Text>{moment(objective.start_date).add(this.props.group.time_frame - 1, 'd').format('DD MMMM YYYY')}</Text></Text>
                        : <Text><Text style={styles.dateLabel}>Date: </Text><Text>{moment(objective.start_date).format('DD MMMM YYYY')}</Text></Text>
                    }
                    {
                        !!objective.proof && objective.proof.created_date &&
                        <Text><Text style={styles.dateLabel}>Proof sent at: </Text><Text>{moment(objective.proof.created_date).format('Do MMMM YYYY, h:mm')}</Text></Text>
                    }
                    {
                        !!objective.proof && objective.proof.type === 'text' &&
                        <Text><Text style={styles.proofLabel}>Proof: </Text><Text>{objective.proof.content}</Text></Text>
                    }
                    {
                        !!objective.proof && objective.proof.type === 'image' &&
                        <View style={styles.imageWrapper}>
                            <Image resizeMode="contain" style={styles.image} source={{uri: objective.proof.image}} />
                        </View>
                    }
                    {
                        !objective.proof && this.props.group.proof_type === 'text' &&
                        <View style={styles.buttonWrapperOpenAddTextProofModal}>
                            <TouchableOpacity style={styles.buttonOpenAddTextProofModal} onPress={() => this.toggleAddTextProofModal(objective.id)}>
                                <Text style={styles.buttonTextOpenAddTextProofModal}>Send proof</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        !objective.proof && this.props.group.proof_type === 'image' &&
                        <View style={styles.buttonWrapperOpenAddTextProofModal}>
                            <TouchableOpacity style={styles.buttonOpenAddTextProofModal} onPress={() => this.takePhotoProof(objective.id)}>
                                <Text style={styles.buttonTextOpenAddTextProofModal}>Take photo proof</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }>
            </ListItem>
        ));

        const rowsObjectivesToVote = this.props.objectivesToVote.map(objective => (
            <ListItem key={objective.id} hideChevron={true} subtitle={
                <View style={styles.objectiveContents}>
                    <Text><Text style={styles.description}>User: </Text><Text>{this.getUser(objective.user) ? this.getUser(objective.user).username : 'unknown'}</Text></Text>
                    <Text><Text style={styles.description}>Description: </Text><Text>{objective.description}</Text></Text>
                    <Text><Text style={styles.bet}>Bet: </Text><Text>{`${objective.bet_value} ${objective.bet_value === 1 ? 'coin' : 'coins'}`}</Text></Text>
                    {
                        this.props.group.time_frame > 1 ?
                        <Text><Text style={styles.dateLabel}>Date: </Text><Text>{moment(objective.start_date).format('DD MMMM YYYY')}</Text> - <Text>{moment(objective.start_date).add(this.props.group.time_frame - 1, 'd').format('DD MMMM YYYY')}</Text></Text>
                        : <Text><Text style={styles.dateLabel}>Date: </Text><Text>{moment(objective.start_date).format('DD MMMM YYYY')}</Text></Text>
                    }
                    {
                        !!objective.proof && objective.proof.created_date &&
                        <Text><Text style={styles.dateLabel}>Proof sent at: </Text><Text>{moment(objective.proof.created_date).format('Do MMMM YYYY, h:mm')}</Text></Text>
                    }
                    {
                        !!objective.proof && objective.proof.type === 'text' &&
                        <Text><Text style={styles.proofLabel}>Proof: </Text><Text>{objective.proof.content}</Text></Text>
                    }
                    {
                        !!objective.proof && objective.proof.type === 'image' &&
                        <View style={styles.imageWrapper}>
                            <Image resizeMode="contain" style={styles.image} source={{uri: objective.proof.image}} />
                        </View>
                    }
                    <View style={styles.modalControlsWrapper}>
                        <TouchableOpacity style={styles.buttonNegativeVote} onPress={() => this.props.sendVote(objective.id, false)}>
                            <Text style={styles.buttonTextOpenAddTextProofModal}>You failed :(</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonPositiveVote} onPress={() => this.props.sendVote(objective.id, true)}>
                            <Text style={styles.buttonTextOpenAddTextProofModal}>Good job!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }>
            </ListItem>
        ));

        const rowsActiveObjectives = this.props.otherUsersActiveObjectives.map(objective => (
            <ListItem key={objective.id} hideChevron={true} subtitle={
                <View style={styles.objectiveContents}>
                    <Text><Text style={styles.description}>User: </Text><Text>{this.getUser(objective.user) ? this.getUser(objective.user).username : 'unknown'}</Text></Text>
                    <Text><Text style={styles.description}>Description: </Text><Text>{objective.description}</Text></Text>
                    <Text><Text style={styles.bet}>Bet: </Text><Text>{`${objective.bet_value} ${objective.bet_value === 1 ? 'coin' : 'coins'}`}</Text></Text>
                    {
                        this.props.group.time_frame > 1 ?
                        <Text><Text style={styles.dateLabel}>Date: </Text><Text>{moment(objective.start_date).format('DD MMMM YYYY')}</Text> - <Text>{moment(objective.start_date).add(this.props.group.time_frame - 1, 'd').format('DD MMMM YYYY')}</Text></Text>
                        : <Text><Text style={styles.dateLabel}>Date: </Text><Text>{moment(objective.start_date).format('DD MMMM YYYY')}</Text></Text>
                    }
                    {
                        !!objective.proof && objective.proof.created_date &&
                        <Text><Text style={styles.dateLabel}>Proof sent at: </Text><Text>{moment(objective.proof.created_date).format('Do MMMM YYYY, h:mm')}</Text></Text>
                    }
                    {
                        !!objective.proof && objective.proof.type === 'text' &&
                        <Text><Text style={styles.proofLabel}>Proof: </Text><Text>{objective.proof.content}</Text></Text>
                    }
                    {
                        !!objective.proof && objective.proof.type === 'image' &&
                        <View style={styles.imageWrapper}>
                            <Image resizeMode="contain" style={styles.image} source={{uri: objective.proof.image}} />
                        </View>
                    }
                </View>
            }>
            </ListItem>
        ));

        const rowsUsers = this.props.users.map(user => (
            <ListItem key={user.id} hideChevron={true} subtitle={
                <View style={styles.userContents}>
                    <Text><Text style={styles.description}>User: </Text><Text>{user.username}</Text></Text>
                    <Text><Text style={styles.description}>Email: </Text><Text>{user.email}</Text></Text>
                </View>
            }>
            </ListItem>
        ));


        return (
            <ScrollView
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)}/>}
                style={styles.container}
            >
                <Modal isVisible={this.state.addTextProofModalVisible}>
                    <View style={styles.modalContent}>
                        <View>
                            <FormInput value={this.state.addTextProofInputValue} onChangeText={this.onChangeAddTextProofInput} placeholder="Enter your proof" />
                        </View>
                        <View style={styles.modalControlsWrapper}>
                            <TouchableOpacity style={styles.buttonCancelSendTextProof} onPress={this.toggleAddTextProofModal}>
                                <Text style={styles.buttonTextOpenAddTextProofModal}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSendTextProof} onPress={this.sendTextProof}>
                                <Text style={styles.buttonTextOpenAddTextProofModal}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.addCommitmentModalVisible}>
                    <View style={styles.modalContent}>
                        <View>
                            <FormInput value={this.state.addCommitmentDescriptionValue} onChangeText={this.onChangeAddCommitmentDescription} placeholder="Description" />
                            <FormInput value={this.state.addCommitmentBetValue} onChangeText={this.onChangeAddCommitmentBet} keyboardType="numeric" placeholder="Bet" />
                            <View style={{marginLeft: 65, marginTop: 10}}>
                                <DatePicker minDate={moment().format('YYYY-MM-DD')} date={this.state.addCommitmentDateValue} mode="date" format="YYYY-MM-DD" onDateChange={this.onChangeAddCommitmentDate} placeholder="Start date" showIcon={false} />
                            </View>
                        </View>
                        <View style={styles.modalControlsWrapper}>
                            <TouchableOpacity style={styles.buttonCancelSendTextProof} onPress={this.toggleAddCommitmentModal}>
                                <Text style={styles.buttonTextOpenAddTextProofModal}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSendTextProof} onPress={this.addCommitment}>
                                <Text style={styles.buttonTextOpenAddTextProofModal}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.addUserModalVisible}>
                    <View style={styles.modalContent}>
                        <View>
                            <FormInput value={this.state.addUserModalUserID} onChangeText={this.onChangeAddUserInput} keyboardType="numeric" placeholder="User ID" />
                        </View>
                        <View style={styles.modalControlsWrapper}>
                            <TouchableOpacity style={styles.buttonCancelSendTextProof} onPress={this.toggleAddUserModal}>
                                <Text style={styles.buttonTextOpenAddTextProofModal}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSendTextProof} onPress={this.addUser}>
                                <Text style={styles.buttonTextOpenAddTextProofModal}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Card style={styles.header} title={this.props.group.title}>
                    <Text>{this.props.group.description}</Text>
                    <Divider style={styles.delimiter} />
                    <Text>Timeframe: <Text style={{fontWeight: 'bold'}}>{this.props.group.time_frame} days</Text></Text>
                    <Text>Proof type: <Text style={{fontWeight: 'bold'}}>{this.props.group.proof_type}</Text></Text>
                    <ButtonElement
                        backgroundColor={Config.DEFAULT_COLOR || '#494e6b'} 
                        title='Make a commitment' 
                        buttonStyle={styles.buttonMakeACommitment}
                        onPress={this.toggleAddCommitmentModal}
                    />
                </Card>
                <Card title="My commitments">
                    {!rowsMyObjectives.length &&
                        <Text style={{textAlign: 'center', color: '#333'}}>You haven't set any commitment.</Text>
                    }
                    {!!rowsMyObjectives.length && rowsMyObjectives.map(objective => objective)}
                </Card>
                <Card title="Vote commitments">
                    {!rowsObjectivesToVote.length &&
                        <Text style={{textAlign: 'center', color: '#333'}}>No commitments to vote.</Text>
                    }
                    {!!rowsObjectivesToVote.length && rowsObjectivesToVote.map(objective => objective)}
                </Card>
                <Card title="Active commitments">
                    {!rowsActiveObjectives.length &&
                        <Text style={{textAlign: 'center', color: '#333'}}>No active commitments.</Text>
                    }
                    {!!rowsActiveObjectives.length && rowsActiveObjectives.map(objective => objective)}
                </Card>
                <Card title="Group members">
                    <View style={styles.buttonWrapperOpenAddUserModal}>
                        <TouchableOpacity style={styles.buttonOpenAddUserModal} onPress={() => this.toggleAddUserModal()}>
                            <Text style={styles.buttonTextOpenAddUserModal}>Add user to group</Text>
                        </TouchableOpacity>
                    </View>
                    {!rowsUsers.length &&
                        <Text style={{textAlign: 'center', color: '#333'}}>This group doesn't have any member.</Text>
                    }
                    {!!rowsUsers.length && rowsUsers.map(user => user)}
                </Card>
                <View style={{paddingTop: 20}} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        
    },
    header: {

    },
    description:
    {
        fontWeight: 'bold'
    },
    bet:
    {
        fontWeight: 'bold'
    },
    dateLabel: {
        fontWeight: 'bold'
    },
    proofLabel: {
        fontWeight: 'bold'
    },
    objectiveContents: {
        paddingTop: 7,
        paddingBottom: 7
    },
    delimiter: {
        marginTop: 12,
        marginBottom: 12
    },
    imageWrapper: {
        backgroundColor: '#EEE',
        flex: 1,
        height: 300,
        marginTop: 20,
        paddingLeft: 0,
        marginLeft: 0,
        paddingRight: 0,
        marginRight: 0
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    buttonWrapperOpenAddTextProofModal: {
        marginTop: 12,
        justifyContent: 'center'
    },
    buttonWrapperOpenAddUserModal: {
        marginTop: 12,
        justifyContent: 'center'
    },
    buttonOpenAddTextProofModal: {
        backgroundColor: Config.DEFAULT_COLOR || '#494e6b',
        borderRadius: 5,
        width: 150
    },
    buttonOpenAddUserModal: {
        backgroundColor: Config.DEFAULT_COLOR || '#494e6b',
        borderRadius: 5
    },
    buttonTextOpenAddTextProofModal: {
        paddingTop: 10,
        paddingBottom: 10,
        color: '#FFF',
        textAlign: 'center'
    },
    buttonTextOpenAddUserModal: {
        paddingTop: 10,
        paddingBottom: 10,
        color: '#FFF',
        textAlign: 'center'
    },
    buttonSendTextProof: {
        backgroundColor: Config.DEFAULT_COLOR || '#494e6b',
        borderRadius: 5,
        width: 120
    },
    buttonCancelSendTextProof: {
        backgroundColor: Config.DEFAULT_COLOR || '#494e6b',
        borderRadius: 5,
        width: 120
    },
    buttonPositiveVote: {
        backgroundColor: '#28a745',
        borderRadius: 5,
        width: 135
    },
    buttonNegativeVote: {
        backgroundColor: '#dc3545',
        borderRadius: 5,
        width: 135
    },
    modalContent: {
        backgroundColor: '#FFF', 
        paddingTop: 20, 
        paddingBottom: 20, 
        paddingLeft: 30, 
        paddingRight: 30,
        borderRadius: 5
    },
    modalControlsWrapper: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop: 25
    },
    buttonMakeACommitment: {
        borderRadius: 0, 
        marginLeft: 0, 
        marginRight: 0, 
        marginBottom: 0,
        marginTop: 25
    },
    userContents: {

    }
});

export default connect(makeMapStateToProps, mapDispatchToProps)(GroupScreen);
