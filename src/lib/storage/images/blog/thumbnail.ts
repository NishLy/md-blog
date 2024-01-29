import { storage } from '$lib/firebase.client';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const uploadThumbnailFile = (file: File, fileName: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const storageRef = ref(storage, 'images/blog/thumbnail/' + fileName + '.png');
		getThumbnailURL(fileName)
			.then(() => {
				deleteObject(storageRef);
			})
			.catch((e) => {
				// Do nothing
				console.log(e);
			})
			.finally(() => {
				const uploadTask = uploadBytesResumable(storageRef, file);

				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log('Upload is ' + progress + '% done');
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused');
								break;
							case 'running':
								console.log('Upload is running');
								break;
						}
					},
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
