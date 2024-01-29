import { db } from '$lib/firebase.client';
import {
	doc,
	getDoc,
	addDoc,
	collection,
	getDocs,
	query,
	where,
	startAfter,
	limit,
	orderBy,
	updateDoc,
	increment,
	DocumentReference
} from 'firebase/firestore';
import type { User } from './user';

export interface Blog {
	id: string;
	title: string;
	content: string;
	likesCount: number;
	commentsCount: number;
	tags: string[];
	date: string;
	readTime: number;
	userId: string;
	summary: string;
	isPublished: boolean;
	thumbnailURL?: string;
}

const collectionName = 'blogs';

export const addBlogReplyCount = async (blogId: string) => {
	return updateDoc(doc(db, collectionName, blogId), {
		commentsCount: increment(1)
	});
};

export const createBlog = async (blog: Omit<Blog, 'id'>): Promise<DocumentReference> => {
	return new Promise((resolve, reject) => {
		addDoc(collection(db, collectionName), blog)
			.then((ref) => {
				resolve(ref);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const updateBlogThumbnailURL = async (blogId: string, thumbnail: string) => {
	return new Promise((resolve, reject) => {
		updateDoc(doc(db, collectionName, blogId), {
			thumbnailURL: thumbnail
		})
			.then(() => {
				resolve('Document successfully updated');
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const getBlog = async (id: string): Promise<Blog> => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, id))
			.then((doc) => {
				if (doc.exists()) {
					resolve({
						id: doc.id,
						...(doc.data() as Omit<Blog, 'id'>)
					});
				} else {
					reject('No such document!');
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const getAllBlogs = async () => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName))
			.then((doc) => {
				if (doc.exists()) {
					resolve(doc.data());
				} else {
					reject('No such document!');
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const getAllBlogByUserId = async (
	userId: string,
	lastVisible: string | null = null,
	_limit = 10
): Promise<Omit<Blog, 'content'>[]> => {
	return new Promise((resolve, reject) => {
		if (!lastVisible) {
			return getDocs(query(collection(db, collectionName), orderBy('date', 'desc'), limit(1))).then(
				(snapshot) => {
					if (snapshot.docs.length <= 0) return resolve([]);
					const q = query(
						collection(db, collectionName),
						where('userId', '==', userId),
						where('isPublished', '==', true),
						orderBy('date', 'desc'),
						limit(_limit)
					);
					getDocs(q)
						.then((snapshot) => {
							resolve(
								snapshot.docs.map((doc) => {
									return {
										id: doc.id,
										title: doc.data().title,
										likesCount: doc.data().likesCount,
										commentsCount: doc.data().commentsCount,
										tags: doc.data().tags,
										date: doc.data().date,
										readTime: doc.data().readTime,
										userId: doc.data().userId,
										summary: doc.data().summary,
										thumbnailURL: doc.data().thumbnailURL ?? null,
										isPublished: doc.data().isPublished
									};
								})
							);
						})
						.catch((error) => {
							reject(error);
						});
				}
			);
		}

		const q = query(
			collection(db, collectionName),
			where('userId', '==', userId),
			where('isPublished', '==', true),
			orderBy('date', 'desc'),
			startAfter(lastVisible),
			limit(_limit)
		);

		getDocs(q)
			.then((snapshot) => {
				resolve(
					snapshot.docs.map((doc) => {
						return {
							id: doc.id,
							title: doc.data().title,
							likesCount: doc.data().likesCount,
							commentsCount: doc.data().commentsCount,
							tags: doc.data().tags,
							date: doc.data().date,
							readTime: doc.data().readTime,
							userId: doc.data().userId,
							summary: doc.data().summary,
							thumbnailURL: doc.data().thumbnailURL ?? null,
							isPublished: doc.data().isPublished
						};
					})
				);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const getAllBlogByTag = async (
	tag: string
): Promise<
	{ post: Omit<Blog, 'content'>; user: { uid: string; displayName: string; photoURL: string } }[]
> => {
	return new Promise((resolve, reject) => {
		const q = query(collection(db, collectionName), where('isPublished', '==', true));
		getDocs(q)
			.then((snapshotBlog) => {
				const blogs: {
					post: Omit<Blog, 'content'>;
					user: { uid: string; displayName: string; photoURL: string };
				}[] = [];

				getDocs(collection(db, 'users')).then((snapshot) => {
					const loadedUsers: Record<string, Partial<User>> = {};

					snapshot.forEach((doc) => {
						loadedUsers[doc.id] = {
							uid: doc.id,
							...(doc.data() as Omit<Omit<User, 'uid'>, 'createdAt'>)
						};

						delete loadedUsers[doc.id].about;
						delete loadedUsers[doc.id].bookmarks;
						delete loadedUsers[doc.id].createdAt;
						delete loadedUsers[doc.id].followers;
						delete loadedUsers[doc.id].following;
					});

					snapshotBlog.forEach((docBlog) => {
						const data = {
							post: {
								id: docBlog.id,
								title: docBlog.data().title,
								likesCount: docBlog.data().likesCount,
								commentsCount: docBlog.data().commentsCount,
								tags: docBlog.data().tags,
								date: docBlog.data().date,
								readTime: docBlog.data().readTime,
								userId: docBlog.data().userId,
								summary: docBlog.data().summary,
								thumbnailURL: docBlog.data().thumbnailURL ?? null,
								isPublished: docBlog.data().isPublished
							},
							user: loadedUsers[docBlog.data().userId] as {
								uid: string;
								displayName: string;
								photoURL: string;
							}
						};

						if (data.post.tags.includes(tag)) {
							blogs.push(data);
						}
					});

					resolve(blogs);
				});
			})
			.catch((error) => {
				reject(error);
			});
	});
};
