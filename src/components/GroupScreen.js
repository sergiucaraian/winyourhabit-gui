import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, StyleSheet, ScrollView, RefreshControl, Image, TouchableOpacity, Button } from 'react-native';
import Modal from "react-native-modal";
import moment from 'moment';
import { Card, Divider, List, ListItem, FormInput } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import ActionButton from 'react-native-action-button';
import { ImagePicker } from 'expo';
import { fetchGroupActiveObjectivesRequest, fetchGroupObjectivesToVoteRequest, sendTextProofRequest, sendPhotoProofRequest } from '../redux/actions';
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
    fetchGroupActiveObjectives: () => dispatch(fetchGroupActiveObjectivesRequest(ownProps.group.id)),
    fetchGroupObjectivesToVote: () => dispatch(fetchGroupObjectivesToVoteRequest(ownProps.group.id)),
    sendTextProof: (objectiveID, proofValue) => dispatch(sendTextProofRequest(ownProps.group.id, objectiveID, proofValue)),
    sendPhotoProof: (objectiveID, photoURI) => dispatch(sendPhotoProofRequest(ownProps.group.id, objectiveID, photoURI))
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
            addTextProofInputValue: ''
        };

        this.toggleAddTextProofModal = this.toggleAddTextProofModal.bind(this);
        this.takePhotoProof = this.takePhotoProof.bind(this);
        this.onChangeAddTextProofInput = this.onChangeAddTextProofInput.bind(this);
        this.sendTextProof = this.sendTextProof.bind(this);
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
            this.props.fetchGroupActiveObjectives(),
            this.props.fetchGroupObjectivesToVote()
        ]);
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

    render()
    {
        const rowsMyObjectives = this.props.myActiveObjectives.map(objective => (
            <ListItem key={objective.id} hideChevron={true} subtitle={
                <View style={styles.objectiveContents}>
                    <Text><Text style={styles.description}>Description: </Text><Text>{objective.description}</Text></Text>
                    <Text><Text style={styles.bet}>Bet: </Text><Text>{`${objective.bet_value} ${objective.bet_value === 1 ? 'coin' : 'coins'}`}</Text></Text>
                    {
                        this.props.group.time_frame > 1 ?
                        <Text><Text style={styles.dateLabel}>Date: </Text><Text>{formatDate(new Date(objective.start_date))}</Text> - <Text>{formatDate(addDays(new Date(objective.start_date), this.props.group.time_frame - 1))}</Text></Text>
                        : <Text><Text style={styles.dateLabel}>Date: </Text><Text>{formatDate(new Date(objective.start_date))}</Text></Text>
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
                    <Text><Text style={styles.description}>Description: </Text><Text>{objective.description}</Text></Text>
                    <Text><Text style={styles.bet}>Bet: </Text><Text>{`${objective.bet_value} ${objective.bet_value === 1 ? 'coin' : 'coins'}`}</Text></Text>
                    {
                        this.props.group.time_frame > 1 ?
                        <Text><Text style={styles.dateLabel}>Date: </Text><Text>{formatDate(new Date(objective.start_date))}</Text> - <Text>{formatDate(addDays(new Date(objective.start_date), this.props.group.time_frame - 1))}</Text></Text>
                        : <Text><Text style={styles.dateLabel}>Date: </Text><Text>{objective.start_date}</Text></Text>
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
                        <View>
                            <TextInput 
                                value={this.state.objectiveProofInput[objective.id] ? this.state.objectiveProofInput[objective.id] : ''}
                                onChangeText={(text) => { 
                                    const objectiveProofInput = this.state.objectiveProofInput;
                                    objectiveProofInput[objective.id] = text;
                                    this.setState({objectiveProofInput});
                                }}
                            />
                            <TouchableOpacity onPress={() => this.sendProofForObjective(objective.id)}>
                                <Text>Send</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }>
            </ListItem>
        ));

        const rowsActiveObjectives = this.props.otherUsersActiveObjectives.map(objective => (
            <ListItem key={objective.id} hideChevron={true} subtitle={
                <View style={styles.objectiveContents}>
                    <Text><Text style={styles.description}>Description: </Text><Text>{objective.description}</Text></Text>
                    <Text><Text style={styles.bet}>Bet: </Text><Text>{`${objective.bet_value} ${objective.bet_value === 1 ? 'coin' : 'coins'}`}</Text></Text>
                    {
                        this.props.group.time_frame > 1 ?
                        <Text><Text style={styles.dateLabel}>Date: </Text><Text>{formatDate(new Date(objective.start_date))}</Text> - <Text>{formatDate(addDays(new Date(objective.start_date), this.props.group.time_frame - 1))}</Text></Text>
                        : <Text><Text style={styles.dateLabel}>Date: </Text><Text>{objective.start_date}</Text></Text>
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
                        <View>
                            <TouchableOpacity onPress={() => this.sendProofForObjective(objective.id)}>
                                <Text>Send</Text>
                            </TouchableOpacity>
                        </View>
                    }
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

                <Card style={styles.header} title={this.props.group.title}>
                    <Text>{this.props.group.description}</Text>
                    <Divider style={styles.delimiter} />
                    <Text>Timeframe: <Text style={{fontWeight: 'bold'}}>{this.props.group.time_frame} days</Text></Text>
                    <Text>Proof type: <Text style={{fontWeight: 'bold'}}>{this.props.group.proof_type}</Text></Text>
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
    buttonOpenAddTextProofModal: {
        backgroundColor: Config.DEFAULT_COLOR || '#494e6b',
        borderRadius: 5,
        width: 150
    },
    buttonTextOpenAddTextProofModal: {
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
    }
});

export default connect(makeMapStateToProps, mapDispatchToProps)(GroupScreen);
