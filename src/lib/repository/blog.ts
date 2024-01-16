import { db } from '$lib/firebase.client';
import { doc, getDoc, addDoc, collection, getDocs } from 'firebase/firestore';
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
	isPublished: boolean;
}

const collectionName = 'blogs';

export const createBlog = async (blog: Omit<Blog, 'id'>) => {
	return await addDoc(collection(db, collectionName), blog);
};

export const getBlog = async (id: string): Promise<Blog> => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, id))
			.then((doc) => {
				if (doc.exists()) {
					resolve(doc.data() as Blog);
				} else {
					reject('No such document!');
				}
			})
			.catch((error) => {
				console.log('Error getting document:', error);
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

export const getAllBlogByTag = async (tag: string): Promise<{ post: Blog; user: User }[]> => {
	return new Promise((resolve, reject) => {
		getDocs(collection(db, collectionName))
			.then((snapshotBlog) => {
				const blogs: { post: Blog; user: User }[] = [];

				getDocs(collection(db, 'users')).then((snapshot) => {
					const loadedUsers: Record<string, User> = {};

					snapshot.forEach((doc) => {
						loadedUsers[doc.id] = {
							uid: doc.id,
							...(doc.data() as Omit<User, 'uid'>)
						};
					});

					snapshotBlog.forEach((docBlog) => {
						const data = {
							post: {
								id: docBlog.id,
								...(docBlog.data() as Omit<Blog, 'id'>)
							},
							user: loadedUsers[docBlog.data().userId] as User
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