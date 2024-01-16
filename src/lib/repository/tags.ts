import { db } from '$lib/firebase.client';
import { collection, deleteDoc, doc, getDoc, query, setDoc, where } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';

const collectionName = 'tags';

export type Tag = {
	name: string;
	followers: number;
	count: number;
};

export const getAllTags = async (): Promise<Tag[]> => {
	return new Promise<Tag[]>((resolve, reject) => {
		const tags: Tag[] = [];

		getDocs(collection(db, collectionName))
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					tags.push(doc.data() as Tag);
				});

				resolve(tags);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const getTag = async (name: string): Promise<Tag> => {
	return new Promise<Tag>((resolve, reject) => {
		const q = query(collection(db, collectionName), where('name', '==', name));
		getDocs(q)
			.then((snapshot) => {
				if (snapshot.size > 0) {
					snapshot.forEach((doc) => {
						return resolve(doc.data() as Tag);
					});
				}

				return reject('Tag not found');
			})
			.catch((error) => {
				return reject(error);
			});
	});
};

export const toggleFollow = async (tagId: string, uid: string) => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, tagId, 'followers', uid))
			.then((docSnap) => {
				if (docSnap.exists()) {
					deleteDoc(doc(db, collectionName, tagId, 'followers', uid));
					resolve('success');
				} else {
					setDoc(doc(db, collectionName, tagId, 'followers', uid), { createdAt: new Date() })
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
