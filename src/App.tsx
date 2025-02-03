import './App.css'
import Authorization from './components/Authorization.tsx'
import Home from './components/Home.tsx'
import UserProfile from './components/UserProfile.tsx'
import NotFound from './components/NotFound.tsx'

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";

function App() {
  return (
       <Router>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/user">User</Link>
                        </li>
                        <li>
                            <Link to="/authorization">Authorize???</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Routes>
                    <Route path="/authorization" element={<Authorization />}/>
                    <Route path="/" element={<Home />}/>
                    <Route path="/user" element={<UserProfile />}/>
                    <Route path="*" element={<NotFound />}/>
                </Routes>
        </Router>
  )
}

export default App
