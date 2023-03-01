import React, { useEffect, useState } from 'react';
import './NewChat.css';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Api from '../Api';

export const NewChat = ({ user, chatlist, show, setShow }) => {
	const [list, setList] = useState([]);

	useEffect(() => {
		const getList = async () => {
			if (user !== null) {
				let results = await Api.getContactList(user.id);
				setList(results);
			}
		};
		getList();
	}, [user]);

	const addNewChat = async (chatUser) => {
		await Api.addNewChat(user, chatUser);

		handleClose();
	};

	const handleClose = () => {
		setShow(false);
	};

	return (
		<div
			className="newChat"
			style={{ left: show ? 0 : -415 }}>
			<div className="newChat--head">
				<div
					className="newChat--backbutton"
					onClick={handleClose}>
					<ArrowBackIcon style={{ color: '#fff' }} />
				</div>
				<div className="newChat--headtitle">Nova Conversa</div>
			</div>
			<div className="newChat--list">
				{list.map((item, key) => (
					<div
						onClick={() => addNewChat(item)}
						className="newChat--item"
						key={key}>
						<img
							className="newChat--itemavatar"
							src={item.avatar}
							alt=""
						/>
						<div className="newChat--itemname">{item.name}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default NewChat;
