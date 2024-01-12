import { db } from '$lib/firebase.client';
import { getDoc, doc, setDoc } from 'firebase/firestore';

const collection = 'users';

export interface User {
	id: string;
	displayName: string;
	email: string;
	followers: number;
	following: number;
	photoURL: string;
}

export const createUser = async (user: Omit<User, 'id'>) => {
	return await setDoc(doc(db, collection), user);
};

export const getUser = async (id: string): Promise<User> => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collection, id))
			.then((doc) => {
				if (doc.exists()) {
					resolve(doc.data() as User);
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
