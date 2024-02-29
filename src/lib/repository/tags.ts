import { db } from '$lib/firebaseApp';
import { addDoc, collection, deleteDoc, doc, limit, query, where } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';

const collectionName = 'tags';

export type Tag = {
	name: string;
	followers: number;
	count: number;
	category: string;
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

export const getTag = async (
	name: string
): Promise<{ id: string; name: string; followers: number; count: number }> => {
	return new Promise((resolve, reject) => {
		const q = query(collection(db, collectionName), where('name', '==', name));
		getDocs(q)
			.then((snapshot) => {
				if (snapshot.size > 0) {
					snapshot.forEach((doc) => {
						return resolve({
							id: doc.id,
							...(doc.data() as Tag)
						});
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
		const q = query(
			collection(db, 'tags-followers'),
			where('uid', '==', uid),
			where('tagId', '==', tagId),
			limit(1)
		);
		getDocs(q)
			.then((docSnap) => {
				if (docSnap.size > 0) {
					deleteDoc(doc(db, 'tags-followers', docSnap.docs[0].id));
					resolve('success');
				} else {
					addDoc(collection(db, 'tags-followers'), { uid, tagId })
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

export const getRandomTags = async (count: number): Promise<Tag[]> => {
	return new Promise<Tag[]>((resolve, reject) => {
		const tags: Tag[] = [];

		getDocs(collection(db, collectionName))
			.then((snapshot) => {
				for (let i = 0; i < count && i < snapshot.size; i++) {
					const index = Math.floor(Math.random() * snapshot.size);
					tags.push(snapshot.docs[index].data() as Tag);
				}

				resolve(tags);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const getFollower = async (tagId: string, uid: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		const q = query(
			collection(db, 'tags-followers'),
			where('uid', '==', uid),
			where('tagId', '==', tagId),
			limit(1)
		);
		getDocs(q)
			.then((docSnap) => {
				if (docSnap.size > 0) {
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
