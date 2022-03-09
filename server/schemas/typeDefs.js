const { gql } = require('apollo-server-express');

const typeDefs = gql`
	input BookInput {
		bookId: String
		authors: [String]
		description: String
		title: String
		image: String
		link: String
	}

	type User {
		_id: ID
		username: String
		email: String
		bookCount: String
		savedBooks: [Book]!
	}

	type Book {
		bookId: String
		authors: [String]
		description: String
		title: String
		image: String
		link: String
	}

	type Auth {
		token: ID!
		user: User
	}

	type Query {
		me: User
	}

	type Mutation {
		login(email: String!, password: String!): Auth
		createUser(username: String!, email: String!, password: String!): Auth
		saveBook(input: BookInput): User
		deleteBook(bookId: String!): User
	}
`;

// TODO: Look into line 42, especially with the array of authors in the input type

module.exports = typeDefs;
