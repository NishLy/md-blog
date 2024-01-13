import { db } from '$lib/firebase.client';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';

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
