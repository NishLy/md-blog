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
	about: string;
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

export const getFollowing = async (uid: string, followId: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, uid, 'following', followId))
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

export const getFollowers = async (uid: string): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		getDocs(collection(db, collectionName, uid, 'followers'))
			.then((docSnap) => {
				resolve(docSnap.docs.map((doc) => doc.id));
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export const toggleFollowUser = async (uid: string, followId: string) => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, uid, 'following', followId))
			.then((docSnap) => {
				if (docSnap.exists()) {
					updateFollowingCount(uid, false, followId);
					updateFollowersCount(followId, false, uid);
					return resolve('success');
				} else {
					updateFollowingCount(uid, true, followId);
					updateFollowersCount(followId, true, uid);
					return resolve('success');
				}
			})
			.catch((error) => {
				return reject(error);
			});
	});
};

const updateFollowingCount = async (uid: string, isFollow: boolean, followId: string) => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, uid))
			.then((docSnap) => {
				if (docSnap.exists()) {
					const count = docSnap.data().following;
					if (isFollow) {
						setDoc(doc(db, collectionName, uid), { ...docSnap.data(), following: count + 1 });
						setDoc(doc(db, collectionName, uid, 'following', followId), { createdAt: new Date() });
					} else {
						setDoc(doc(db, collectionName, uid), { ...docSnap.data(), following: count - 1 });
						deleteDoc(doc(db, collectionName, uid, 'following', followId));
					}
					resolve('success');
				} else {
					reject('No such document!');
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
};

const updateFollowersCount = async (uid: string, isFollow: boolean, followId: string) => {
	return new Promise((resolve, reject) => {
		getDoc(doc(db, collectionName, uid))
			.then((docSnap) => {
				if (docSnap.exists()) {
					const count = docSnap.data().followers;
					if (isFollow) {
						setDoc(doc(db, collectionName, uid), { ...docSnap.data(), followers: count + 1 });
						setDoc(doc(db, collectionName, uid, 'followers', followId), { createdAt: new Date() });
					} else {
						setDoc(doc(db, collectionName, uid), { ...docSnap.data(), followers: count - 1 });
						deleteDoc(doc(db, collectionName, uid, 'followers', followId));
					}
					resolve('success');
				} else {
					reject('No such document!');
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
		checkUserExists(user.uid)
			.then((exists) => {
				if (exists) {
					return resolve({
						success: true,
						isNewEntry: false
					});
				} else {
					setDoc(doc(db, collectionName, user.uid), {
						...user,
						followers: 0,
						following: 0,
						createdAt: new Date(),
						about: null
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
			})
			.catch((error) => {
				reject(error);
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
