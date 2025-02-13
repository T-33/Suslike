import '../src/styles/App.css'
import Authorization from './components/Authorization.tsx'
import Home from './components/Home.tsx'
import UserProfile from './components/UserProfile.tsx'
import NotFound from './components/NotFound.tsx'
import Registration from './components/Registration.tsx'
import ResetPassword from './components/ResetPassword.tsx'
import AddPost from "./components/AddPost.tsx"
import Favorites from './components/Favorites.tsx'
import Layout from './components/Layout.tsx'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {useState} from "react"

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="authorization" element={<Authorization/>}/>
                    <Route path="register" element={<Registration/>}/>
                    <Route path="reset-password" element={<ResetPassword/>}/>

                    <Route path="/" element={<Layout openModal={openModal} />}>
                        <Route index element={<Home/>}/>
                        <Route path="user/:username" element={<UserProfile/>}/>
                        <Route path="search"/>
                        <Route path="favorites" element={<Favorites/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Route>
                </Routes>

                <AddPost isOpen={isModalOpen} onClose={closeModal} />
            </div>
        </Router>
    )
}
export default App
