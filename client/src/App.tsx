import { useState } from 'react';
import LoginForm from './components/LoginForm.tsx';
import MainView from './components/MainView.tsx';
function App() {
    const [userName, setUserName] = useState('');

    return userName ? <MainView currentUser={userName} /> : <LoginForm onSubmit={setUserName} />;
}

export default App;
