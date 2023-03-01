import React from 'react';
import Api from '../Api';
import './Login.css';

export const Login = ({ onReceive }) => {
	const handleFacebookLogin = async () => {
		let result = await Api.fbPopup();
		if (result) {
			onReceive(result.user);
		} else {
			alert('Erro!');
		}
	};

	const handleGoogleLogin = async () => {
		let result = await Api.glgPopup();
		if (result) {
			onReceive(result.user);
		} else {
			alert('Erro!');
		}
	};
	const handleGithubLogin = async () => {
		let result = await Api.gthbPopup();
		if (result) {
			onReceive(result.user);
		} else {
			alert('Erro!');
		}
	};

	return (
		<div className="login">
			<button onClick={handleFacebookLogin}>Logar com Facebook</button>
			<button onClick={handleGoogleLogin}>Logar com Google</button>
			<button onClick={handleGithubLogin}>Logar com Github</button>
		</div>
	);
};

export default Login;
