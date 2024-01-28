import { db } from '$lib/firebase.client';
import {
	addDoc,
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where
} from 'firebase/firestore';
import { getBlog } from './blog';

export type CommentInterface = {
	id: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	likesCount: number;
	repliesCount: number;
	user: {
		uid: string;
		displayName: string;
		photoURL: string;
	};
	blogId: string;
	authorId: string;
	level: number;
	parentId: string | undefined | null;
};

const collectionName = 'comments';

export const createComment = async (comment: {
	content: string;
	user: {
		uid: string;
		displayName: string;
		photoURL: string;
	};
	level: number;
	parentId: string | undefined;
	blogId: string;
}) => {
	return new Promise((resolve, reject) => {
		getBlog(comment.blogId)
			.then((blog) => {
				if (!blog) {
					return reject('Blog not found');
				}
				const commentFilled: Omit<CommentInterface, 'id'> = {
					content: comment.content,
					user: {
						uid: comment.user.uid,
						displayName: comment.user.displayName,
						photoURL: comment.user.photoURL
					},
					level: comment.level,
					parentId: !comment.parentId ? null : comment.parentId,
					blogId: comment.blogId,
					authorId: blog.userId,
					createdAt: new Date(),
					updatedAt: new Date(),
					likesCount: 0,
					repliesCount: 0
				};

				addDoc(collection(db, collectionName), commentFilled)
					.then((docRef) => {
						resolve(docRef.id);
					})
					.catch((error) => {
						reject(error);
					});
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const getComments = async (
	blogId: string,
	starAfter: string | undefined = undefined,
	_limit = 10
) => {
	return new Promise((resolve, reject) => {
		let q = query(
			collection(db, collectionName),
			where('blogId', '==', blogId),
			orderBy('createdAt', 'desc'),
			limit(_limit)
		);

		if (!starAfter)
			return getDocs(q)
				.then(async (querySnapshot) => {
					let comments: ({
						children?: ({ children?: CommentInterface[] } & CommentInterface)[];
					} & CommentInterface)[] = [];

					comments = querySnapshot.docs
						.filter((doc) => {
							return doc.data().level === 1;
						})
						.map((doc) => {
							return {
								id: doc.id,
								...(doc.data() as Omit<CommentInterface, 'id'>),
								createdAt: doc.data().createdAt.toDate(),
								updatedAt: doc.data().updatedAt.toDate()
							};
						});

					for await (const comment of comments) {
						comment.children = await getCommentsByParentId(comment.id, 2);
						for await (const child of comment.children) {
							child.children = await getCommentsByParentId(child.id, 3);
						}
					}

					resolve(comments);
				})
				.catch((error) => {
					reject(error);
				});

		q = query(
			collection(db, collectionName),
			where('blogId', '==', blogId),
			orderBy('createdAt', 'desc'),
			startAfter(starAfter),
			limit(_limit)
		);

		return getDocs(q).then(async (querySnapshot) => {
			let comments: ({
				children?: ({ children?: CommentInterface[] } & CommentInterface)[];
			} & CommentInterface)[] = [];

			comments = querySnapshot.docs
				.filter((doc) => {
					return doc.data().level === 1;
				})
				.map((doc) => {
					return {
						id: doc.id,
						...(doc.data() as Omit<CommentInterface, 'id'>),
						createdAt: doc.data().createdAt.toDate(),
						updatedAt: doc.data().updatedAt.toDate()
					};
				});

			for await (const comment of comments) {
				comment.children = await getCommentsByParentId(comment.id, 2);
				for await (const child of comment.children) {
					child.children = await getCommentsByParentId(child.id, 3);
				}
			}

			resolve(comments);
		});
	});
};

const getCommentsByParentId = async (
	parentId: string,
	level: number
): Promise<CommentInterface[]> => {
	return new Promise((resolve, reject) => {
		const q = query(
			collection(db, collectionName),
			where('parentId', '==', parentId),
			where('level', '==', level),
			orderBy('createdAt', 'desc')
		);

		return getDocs(q)
			.then((querySnapshot) => {
				let comments = [];

				comments = querySnapshot.docs.map((doc) => {
					return {
						id: doc.id,
						...(doc.data() as Omit<CommentInterface, 'id'>),
						createdAt: doc.data().createdAt.toDate(),
						updatedAt: doc.data().updatedAt.toDate()
					};
				}) as CommentInterface[];

				resolve(comments);
			})
			.catch((error) => {
				reject(error);
			});
	});
};
