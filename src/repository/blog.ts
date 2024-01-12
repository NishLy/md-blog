import { db } from '$lib/firebase.client';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface Blog {
	id: string;
	title: string;
	content: string;
	likesCount: number;
	commentsCount: number;
	tags: string[];
	date: Date;
	readTime: number;
}

const collection = 'blogs';

export const createBlog = async (blog: Blog) => {
	return await setDoc(doc(db, collection, blog.id), blog);
};

export const getBlog = async (id: string): Promise<Blog> => {
	console.log('getBlog', db);
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collection, id))
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
		getDoc(doc(db, collection))
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
