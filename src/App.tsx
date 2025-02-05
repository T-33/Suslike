import './App.css'
import Authorization from './components/Authorization.tsx'
import Home from './components/Home.tsx'
import UserProfile from './components/UserProfile.tsx'
import NotFound from './components/NotFound.tsx'

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

function App() {
  return (
       <Router>
                <Routes>
                    <Route path="/authorization" element={<Authorization />}/>
                    <Route path="/" element={<Home />}/>
                    <Route path="/user/:userId" element={<UserProfile />}/>
                    <Route path="*" element={<NotFound />}/>
                </Routes>
        </Router>
  )
}

export default App
