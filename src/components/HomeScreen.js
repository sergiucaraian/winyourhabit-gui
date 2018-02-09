import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, Text, TextInput, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { List, ListItem, Card } from 'react-native-elements';
import { Actions, Drawer } from 'react-native-router-flux';
import { fetchUsersRequest, fetchGroupsRequest, fetchUserGroupsRequest } from '../redux/actions';
import { getLoggedInUserGroups } from '../redux/selectors';

const mapStateToProps = state => ({
    groups: getLoggedInUserGroups(state)
});

const mapDispatchToProps = dispatch => ({
    fetchUsers: () => dispatch(fetchUsersRequest()),
    fetchGroups: () => dispatch(fetchGroupsRequest()),
    fetchUserGroups: () => dispatch(fetchUserGroupsRequest())
});

class HomeScreen extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            refreshing: false,
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
            this.props.fetchUsers(),
            this.props.fetchGroups(),
            this.props.fetchUserGroups()
        ]);
    }

    render()
    {
        const rows = this.props.groups.map(group => (
            <ListItem key={group.title} title={group.title} subtitle={group.description} subtitleNumberOfLines={3} onPress={() => Actions.group({group})} />
        ));

        return (
            <ScrollView
                styles={styles.container}
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefresh.bind(this)}
                    />
                }
            >
                {!this.props.groups.length &&
                    <Card><Text style={{textAlign: 'center', color: '#333'}}>No groups found.</Text></Card>
                }
                {!!rows.length && 
                    <Card containerStyle={{padding: 0}}>
                        {rows.map(row => row)}
                    </Card>
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        marginTop: 200
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
