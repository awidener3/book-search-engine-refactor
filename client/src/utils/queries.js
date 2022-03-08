import { gql } from '@apollo/client';

export const QUERY_ME = gql`
	query me($username: String) {
		me(username: $username) {
			username
			email
			savedBooks {
				authors
				title
				description
				bookId
			}
		}
	}
`;
