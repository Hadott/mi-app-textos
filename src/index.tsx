import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import { LoginForm } from './LoginForm';

function RootApp() {
  const [token, setToken] = React.useState<string | null>(null);

  const handleLogout = () => setToken(null);

  return token ? (
    <App token={token} onLogout={handleLogout} />
  ) : (
    <LoginForm onLogin={setToken} />
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);


reportWebVitals();
