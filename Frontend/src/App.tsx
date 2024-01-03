import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/register';
import Navbar from "./components/Navbar";
import SignIn from './pages/signIn';
import VideoChat from './pages/video_chat';
import ContactList from './pages/ContactList';
import IncomingCallModal from './pages/IncomingCallModal';
import Calling from './pages/calling';

import { AppProvider as UserAppProvider } from "./context/user.context"
import { AppProvider as SocketProvider } from "./context/socket.context"



function App() {


  return (
    <>
      <UserAppProvider>
          <Router>
        <SocketProvider>
            <Routes>
              <Route path="/" element={<><Navbar /><Home /></>} />
              <Route path="/registration" element={<><Navbar /><Register /></>} />
              <Route path="/signIn" element={<><Navbar /><SignIn /></>} />
              <Route path="/video_call" element={<><Navbar /><VideoChat /></>} />
              <Route path="/IncommingCall" element={<><IncomingCallModal/></>} /> 
              <Route path="/calling" element={<><Calling/></>} /> 
              <Route path="/contactList" element={<><Navbar /><ContactList /></>} />
    
            </Routes>
        </SocketProvider>
          </Router>
      </UserAppProvider>
    </>
  )

}

export default App
