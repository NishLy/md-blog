// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAj37cNHBnrX-fguOT-RwgGPttWc6Lum-g',
	authDomain: 'md-blog-968db.firebaseapp.com',
	projectId: 'md-blog-968db',
	storageBucket: 'md-blog-968db.appspot.com',
	messagingSenderId: '922617899521',
	appId: '1:922617899521:web:a980b79b487c22e313ae00',
	measurementId: 'G-WH6LYV2FSL'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
