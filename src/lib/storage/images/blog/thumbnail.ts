import { storage } from '$lib/firebaseApp';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const uploadThumbnailFile = (file: File, fileName: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const storageRef = ref(storage, 'images/blog/thumbnail/' + fileName + '.png');
		getThumbnailURL(fileName)
			.then(() => {
				deleteObject(storageRef);
			})
			.catch(() => {
				// Do nothing
			})
			.finally(() => {
				const uploadTask = uploadBytesResumable(storageRef, file);

				uploadTask.on(
					'state_changed',
					() => {},
					(error) => {
						reject(error);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					}
				);
			});
	});
};

export const getThumbnailURL = (fileName: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const storageRef = ref(storage, 'images/blog/thumbnail/' + fileName + '.png');
		getDownloadURL(storageRef)
			.then((url) => {
				resolve(url);
			})
			.catch((error) => {
				reject(error);
			});
	});
};
