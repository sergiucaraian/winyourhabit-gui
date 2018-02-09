import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, StyleSheet, ScrollView, RefreshControl, Image, TouchableOpacity, Button } from 'react-native';
import Modal from "react-native-modal";
import { Card, Divider, List, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import { fetchGroupActiveObjectivesRequest, fetchGroupObjectivesToVoteRequest } from '../redux/actions';
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
    fetchGroupObjectivesToVote: () => dispatch(fetchGroupObjectivesToVoteRequest(ownProps.group.id))
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
            myObjectivesModalVisible: false,
            objectivesToVoteModalVisible: false,
            activeObjectivesModalVisible: false
        };
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

    sendProofForObjective(objectiveID)
    {
        this.submitProofForObjective(objectiveID, this.state.objectiveProofInput[objectiveID]);
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

        return (
            <ScrollView 
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)}/>}
                style={styles.container}
            >
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'grey'
      },
    innerContainer: {
    alignItems: 'center',
    },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(GroupScreen);
