import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
	addDoc,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	documentId,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export const Api = {
	fbPopup: async () => {
		const provider = new FacebookAuthProvider();
		let result = await signInWithPopup(auth, provider);
		return result;
	},
	glgPopup: async () => {
		try {
			const provider = new GoogleAuthProvider();
			let result = await signInWithPopup(auth, provider);
			return result;
		} catch (e) {
			console.error('Erro: ', e);
		}
	},
	gthbPopup: async () => {
		try {
			const provider = new GithubAuthProvider();
			let result = await signInWithPopup(auth, provider);
			return result;
		} catch (e) {
			console.error('Erro: ', e);
		}
	},
	addUser: async (u) => {
		const userRef = doc(collection(db, 'users'), u.id);
		const docSnap = await getDoc(userRef);

		if (docSnap.exists()) {
			await updateDoc(userRef, {
				name: u.name,
				avatar: u.avatar,
			});
		} else {
			await setDoc(userRef, {
				name: u.name,
				avatar: u.avatar,
			});
		}
	},
	deleteUser: async (u) => {
		const userRef = doc(collection(db, 'users'), u.id);
		await deleteDoc(userRef, u);
	},
	editUser: async (u) => {
		const userRef = doc(collection(db, 'users'), u.id);
		await updateDoc(userRef, u);
	},
	getContactList: async (userId) => {
		const userRef = collection(db, 'users');
		const q = query(userRef, where(documentId(), '!=', userId));

		let list = [];

		const usersSnapshot = await getDocs(q);
		usersSnapshot.forEach((doc) => {
			list.push({
				id: doc.id,
				name: doc.data().name,
				avatar: doc.data().avatar,
			});
		});

		return list;
	},
	addNewChat: async (user, chatUser) => {
		let newChat = await addDoc(collection(db, 'chats'), {
			messages: [],
			users: [user.id, chatUser.id],
		});

		const userRef = doc(db, 'users', user.id);
		await updateDoc(userRef, {
			chats: arrayUnion({
				chatId: newChat.id,
				title: chatUser.name,
				image: chatUser.avatar,
				with: chatUser.id,
			}),
		});
		const chatUserRef = doc(db, 'users', chatUser.id);
		await updateDoc(chatUserRef, {
			chats: arrayUnion({
				chatId: newChat.id,
				title: user.name,
				image: user.avatar,
				with: user.id,
			}),
		});
	},
	onChatList: (userID, setChatList) => {
		return onSnapshot(doc(db, 'users', userID), (doc) => {
			if (doc.exists) {
				let data = doc.data();
				if (data.chats) {
					let chats = [...data.chats];

					chats.sort((a, b) => {
						if (a.lastMessageDate === undefined) {
							return -1;
						}
						if (b.lastMessageDate === undefined) {
							return -1;
						}

						if (a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
							return 1;
						} else {
							return -1;
						}
					});

					setChatList(chats);
				}
			}
		});
	},
	onChatContent: (chatId, setList, setUsers) => {
		return onSnapshot(doc(db, 'chats', chatId), (doc) => {
			if (doc.exists) {
				let data = doc.data();
				setList(data.message);
				setUsers(data.users);
			}
		});
	},
	sendMessage: async (chatData, userId, type, body, users) => {
		let now = new Date();

		const chatRef = doc(db, 'chats', chatData.chatId);
		await updateDoc(chatRef, {
			message: arrayUnion({
				type,
				author: userId,
				body,
				date: now,
			}),
		});

		for (let i in users) {
			const docRef = doc(db, 'users', users[i]);
			let docSnap = await getDoc(docRef);
			let uData = docSnap.data();
			if (uData.chats) {
				let chats = [...uData.chats];

				for (let e in chats) {
					if (chats[e].chatId === chatData.chatId) {
						chats[e].lastMessage = body;
						chats[e].lastMessageDate = now;
					}
				}

				await updateDoc(docRef, {
					chats,
				});
			}
		}
	},
};

export default Api;
