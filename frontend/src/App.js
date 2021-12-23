import React, { useState } from "react";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import CheckLog from "./CheckLog";
import './styles/App.css';

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<CheckLog userInfo={userInfo} setUser={setUserInfo} />} />
          <Route path="/login" element={<Login setUser={setUserInfo} />} />
          <Route path="/signup" element={<Signup setUser={setUserInfo} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*
<Link className="App-link" to="/signup">signup</Link>
<Link className="App-link" to="/login">login</Link>
*/