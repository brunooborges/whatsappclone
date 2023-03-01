import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
	apiKey: 'AIzaSyD66zmgx_VRYPfjwsFxeBMNZ-JkKQlpJlU',
	authDomain: 'whatsappclone-84114.firebaseapp.com',
	projectId: 'whatsappclone-84114',
	storageBucket: 'whatsappclone-84114.appspot.com',
	messagingSenderId: '973728135944',
	appId: '1:973728135944:web:52c9e8f2916a43b9f3cabd',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
