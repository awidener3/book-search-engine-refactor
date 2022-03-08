const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		// Get user
		me: async (parent, { username }) => {
			return User.findOne({ username }).populate('books');
		},
	},
	Mutation: {
		// Create user
		createUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		// Login user, sign token, send back
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError(
					'No user found with this email address'
				);
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError('Incorrect credentials');
			}

			const token = signToken(user);

			return { token, user };
		},
		// Save book
		saveBook: async (parent, { user, body }) => {
			const updatedUser = await User.findOneAndUpdate(
				{ _id: user._id },
				{ $addToSet: { savedBooks: body } },
				{ new: true, runValidators: true }
			);

			return updatedUser;
		},
		// Delete book
		deleteBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const book = await Book.findOneAndDelete({
					_id: bookId,
				});

				await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId: bookId } } },
					{ new: true }
				);

				return book;
			}
			throw new AuthenticationError('You need to be logged in!');
		},
	},
};

module.exports = resolvers;
