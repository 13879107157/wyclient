// NOD-client/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './pages/App/App';
import AuthPage from './pages/Auth/AuthPage';
import { routes } from './config/routes';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />}>
                    {routes.map((route, index) => (
                        // @ts-ignore
                        <Route key={index} {...route} />
                    ))}
                </Route>
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
        </Router>
    </StrictMode>
);