import '../src/styles/App.css'
import Authorization from './components/Authorization.tsx'
import Home from './components/Home.tsx'
import UserProfile from './components/UserProfile.tsx'
import NotFound from './components/NotFound.tsx'

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation
} from "react-router-dom";

function AppContent() {
    const location = useLocation();
    const showNavigation = location.pathname === '/';

    return (
        <>
            {showNavigation && (
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/user">User</Link>
                        </li>
                        <li>
                            <Link to="/authorization">Authorize</Link>
                        </li>
                    </ul>
                </nav>
            )}

            <Routes>
                <Route path="/authorization" element={<Authorization />} />
                <Route path="/" element={<Home />} />
                <Route path="/user" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
export default App
