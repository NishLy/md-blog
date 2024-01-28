import { db } from '$lib/firebase.client';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	limit,
	orderBy,
	query,
	startAfter,
	updateDoc,
	where
} from 'firebase/firestore';
import { addBlogReplyCount, getBlog } from './blog';
import { ForbiddenError } from '$lib/error/errors';

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

				if (commentFilled.parentId) addCommentReplyCount(commentFilled.parentId as string);
				addBlogReplyCount(commentFilled.blogId);

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

export const addCommentReplyCount = async (commentId: string) => {
	return new Promise((resolve, reject) => {
		const commentRef = doc(db, collectionName, commentId);

		return updateDoc(commentRef, {
			repliesCount: increment(1)
		})
			.then(() => {
				resolve('Reply count updated');
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const updateCommentContent = async (commentId: string, content: string, userId: string) => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, commentId))
			.then((docSnap) => {
				if (!docSnap.exists()) {
					return reject('Comment not found');
				}

				if (docSnap.data().user.uid !== userId) {
					return reject(new ForbiddenError('You are not allowed to update this comment'));
				}

				updateDoc(doc(db, collectionName, commentId), {
					content,
					updatedAt: new Date()
				})
					.then(() => {
						resolve('Comment updated');
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
			startAfter(new Date(starAfter)),
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
