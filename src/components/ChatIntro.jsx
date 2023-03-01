import React from 'react';
import './ChatIntro.css';

export const ChatIntro = () => {
	return (
		<div className="chatIntro">
			<img
				src="/intro-connection-light.jpg"
				alt=""
			/>
			<h1>Mantenha o seu celular conectado</h1>
			<h2>
				O WhatsApp conecata ao seu telefone para sincronizar suas mensagens. <br />
				Para Reduzir o uso de dados, conecte o seu telefone a uma rede Wi-Fi.
			</h2>
		</div>
	);
};

export default ChatIntro;
