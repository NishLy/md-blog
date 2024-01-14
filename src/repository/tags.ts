import { db } from '$lib/firebase.client';
import { collection, query, where } from 'firebase/firestore';
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
