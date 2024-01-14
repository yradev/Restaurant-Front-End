import { useState } from 'react';
import Router from './Router';
import Header from './components/fragments/Header';

function App() {
	const [headerTransperant, setHeaderTransperant] = useState(false);

	return (
		<div className="Wrapper">
			<Header />

			<div className="main">
				<Router />
			</div>

			<footer className="footer">
			</footer>
		</div>
	);
}

export default App;



