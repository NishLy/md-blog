import { db } from '$lib/firebase.client';
import { getDoc, doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

const collectionName = 'users';

export interface User {
	uid: string;
	displayName: string;
	email: string;
	followers: number;
	following: number;
	photoURL: string;
	createdAt: string;
	bookmarks: string[];
}

export const createUser = async (user: Omit<User, 'uid'>) => {
	return await setDoc(doc(db, collectionName), user);
};

export const toggleBookmark = async (uid: string, bookmarkId: string) => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, uid, 'bookmarks', bookmarkId))
			.then((docSnap) => {
				if (docSnap.exists()) {
					deleteDoc(doc(db, collectionName, uid, 'bookmarks', bookmarkId));
					resolve('success');
				} else {
					setDoc(doc(db, collectionName, uid, 'bookmarks', bookmarkId), { createdAt: new Date() })
						.then(() => {
							resolve('success');
						})
						.catch((error) => {
							reject(error);
						});
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const checkUserExists = async (id: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, id))
			.then((docSnap) => {
				if (docSnap.exists()) {
					resolve(true);
				} else {
					resolve(false);
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const addUser = async (
	user: Partial<User> & { uid: string }
): Promise<{
	success: boolean;
	isNewEntry: boolean;
}> => {
	return new Promise((resolve, reject) => {
		checkUserExists(user.uid).then((exists) => {
			if (exists) {
				return resolve({
					success: true,
					isNewEntry: false
				});
			} else {
				setDoc(doc(db, collectionName, user.uid), {
					...user,
					followers: 0,
					following: 0
				})
					.then(() => {
						setDoc(doc(db, collectionName, user.uid, 'bookmarks', 'default'), {
							createdAt: new Date()
						});

						return resolve({
							success: true,
							isNewEntry: true
						});
					})
					.catch((error) => {
						reject(error);
					});
			}
		});
	});
};

export const getUser = async (id: string): Promise<User> => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, id))
			.then((docSnap) => {
				if (docSnap.exists()) {
					getDocs(collection(db, collectionName, docSnap.id, 'bookmarks'))
						.then((querySnapshot) => {
							const bookmarks: string[] = [];
							querySnapshot.forEach((doc) => {
								bookmarks.push(doc.id);
							});
							resolve({
								...(docSnap.data() as User),
								uid: docSnap.id,
								bookmarks,
								createdAt: docSnap.data().createdAt.toDate()
							});
						})
						.catch((error) => {
							reject(error);
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
