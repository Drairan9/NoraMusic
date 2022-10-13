import cassandra from 'cassandra-driver';
import CassandraStore from 'cassandra-store';

const authProvider = new cassandra.auth.PlainTextAuthProvider(process.env.DB_USERNAME, process.env.DB_PASSWORD);
var client;

const cassandraStoreOptions = {
    table: 'user_sessions',
    client: null,
    clientOptions: {
        contactPoints: [process.env.DB_CONTACT_POINT],
        keyspace: process.env.DB_KEYSPACE,
        authProvider: authProvider,
        queryOptions: {
            prepare: true,
        },
    },
};

export default client = new cassandra.Client({
    contactPoints: [process.env.DB_CONTACT_POINT],
    keyspace: process.env.DB_KEYSPACE,
    localDataCenter: 'datacenter1',
    authProvider: authProvider,
});

export var cassandraStore = new CassandraStore(cassandraStoreOptions);
