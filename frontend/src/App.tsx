import '../src/styles/App.css'
import Authorization from './components/Authorization.tsx'
import Home from './components/Home.tsx'
import UserProfile from './components/UserProfile.tsx'
import NotFound from './components/NotFound.tsx'
import Registration from './components/Registration.tsx'
import ResetPassword from './components/ResetPassword.tsx'
import AddPostForm from "./components/AddPost.tsx";
import Favorites from './components/Favorites.tsx'
import Layout from './components/Layout.tsx'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="user/:username" element={<UserProfile />} />
                    <Route path="search" element={<Home />} />
                    <Route path="add-post" element={<AddPostForm />} />
                    <Route path="authorization" element={<Authorization />} />
                    <Route path="register" element={<Registration />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="favorites" element={<Favorites/>}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default App
