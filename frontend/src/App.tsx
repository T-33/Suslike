import '../src/styles/App.css'
import Authorization from './components/Authorization.tsx'
import Home from './components/Home.tsx'
import UserProfile from './components/UserProfile.tsx'
import NotFound from './components/NotFound.tsx'
import Registration from './components/Registration.tsx'
import ResetPassword from './components/ResetPassword.tsx'
import AddPostForm from "./components/AddPost.tsx";


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
                            <Link to="/user">User</Link>
                        </li>
                        <li>
                            <Link to="/authorization">Authorize</Link>
                        </li>
                        <li>
                            <Link to={"/register"} >Register </Link>
                        </li>
                        <li>
                            <Link to={"/add-post"}>Add post</Link>
                        </li>
                    </ul>
                </nav>
            )}

            <Routes>
                <Route path="/authorization" element={<Authorization />} />
                <Route path="/" element={<Home />} />
                <Route path="/user/:username" element={<UserProfile />}/>
                <Route path="*" element={<NotFound />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/add-post" element={<AddPostForm/>} />
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
