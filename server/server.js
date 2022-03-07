const express = require('express');
// Bring in apollo server package
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
//  JWT authentication
const { authMiddleware } = require('./utils/auth');

//  Needed for apollo
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// ? not needed
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
// Apollo server
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// ? not needed
// app.use(routes);

// New apollo instance with GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
	await server.start();
	server.applyMiddleware({ app });

	db.once('open', () => {
		app.listen(PORT, () =>
			console.log(`🌍 Now listening on localhost:${PORT}`)
		);
	});
};

// Start server
startApolloServer(typeDefs, resolvers);
