import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import './styles.css';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';

import Api from '../../Api';
import MessageItem from '../MessageItem';

export const ChatWindow = ({ user, data }) => {
	const body = useRef();

	let recognition = null;
	let SpeechRecognition = window.SpeechRecognitionResult || window.webkitSpeechRecognition;
	if (SpeechRecognition !== undefined) {
		recognition = new SpeechRecognition();
	}

	const [emojiOpen, setEmojiOpen] = useState(false);
	const [text, setText] = useState('');
	const [listening, setListening] = useState(false);
	const [users, setUsers] = useState([]);
	const [list, setList] = useState([]);

	useEffect(() => {
		setList([]);
		let unsub = Api.onChatContent(data.chatId, setList, setUsers);
		return unsub;
	}, [data.chatId]);

	useEffect(() => {
		if (body.current.scrollHeight > body.current.offsetHeight) {
			body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
		}
	}, [list]);

	const handleEmojiClick = (e) => {
		setText(text + e.emoji);
	};

	const handleOpenEmoji = () => {
		setEmojiOpen(true);
	};

	const handleCloseEmoji = () => {
		setEmojiOpen(false);
	};

	const handleMicClick = () => {
		if (recognition !== null) {
			recognition.onstart = () => {
				setListening(true);
			};
			recognition.onend = () => {
				setListening(false);
			};
			recognition.onresult = (e) => {
				setText(e.results[0][0].transcript);
			};

			recognition.start();
		} else {
			alert('Navegador não suporta uso de Microfone.');
		}
	};

	const handleInputKeyUp = (e) => {
		if (e.keyCode === 13) {
			handleSendClick();
		}
	};

	const handleSendClick = () => {
		if (text !== '') {
			Api.sendMessage(data, user.id, 'text', text, users);
			setText('');
			setEmojiOpen(false);
		}
	};

	return (
		<div className="chatWindow">
			<div className="chatWindow--header">
				<div className="chatWindow--headerinfo">
					<img
						className="chatWindow--avatar"
						src={data.image}
						alt=""
					/>
					<div className="chatWindow--name">{data.title}</div>
				</div>
				<div className="chatWindow--headerbuttons">
					<div className="chatWindow--btn">
						<SearchIcon style={{ color: '#919191' }} />
					</div>
					<div className="chatWindow--btn">
						<AttachFileIcon style={{ color: '#919191' }} />
					</div>
					<div className="chatWindow--btn">
						<MoreVertIcon style={{ color: '#919191' }} />
					</div>
				</div>
			</div>
			<div
				ref={body}
				className="chatWindow--body">
				{list &&
					list.map((item, key) => (
						<MessageItem
							key={key}
							data={item}
							user={user}
						/>
					))}
			</div>

			<div
				className="chatWindow--emojiarea"
				style={{ height: emojiOpen ? '200px' : '0' }}>
				<EmojiPicker
					height={500}
					width={'auto'}
					onEmojiClick={handleEmojiClick}
					searchDisabled
					skinTonesDisabled
					previewConfig={{ showPreview: false }}
				/>
			</div>

			<div className="chatWindow--footer">
				<div className="chatWindow--pre">
					<div
						className="chatWindow--btn"
						onClick={handleCloseEmoji}
						style={{ width: emojiOpen ? 40 : 0 }}>
						<CloseIcon style={{ color: '#919191' }} />
					</div>
					<div
						className="chatWindow--btn"
						onClick={handleOpenEmoji}>
						<InsertEmoticonIcon style={{ color: emojiOpen ? '#009688' : '#919191' }} />
					</div>
				</div>
				<div className="chatWindow--inputarea">
					<input
						className="chatWindow--input"
						type="text"
						placeholder="Digite uma mensagem"
						id=""
						value={text}
						onChange={(e) => setText(e.target.value)}
						onKeyUp={handleInputKeyUp}
					/>
				</div>
				<div className="chatWindow--pos">
					{text === '' && (
						<div
							onClick={handleMicClick}
							className="chatWindow--btn">
							<MicIcon style={{ color: listening ? '#126Ece' : '#919191' }} />
						</div>
					)}
					{text !== '' && (
						<div
							onClick={handleSendClick}
							className="chatWindow--btn">
							<SendIcon style={{ color: '#919191' }} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
