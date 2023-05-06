import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import LogBox from './LogBox';
import UnityComponent from './UnityComponent';
function App() {
  const [messages, setMessages]=useState([])
  const [newMessage, setNewMessage] = useState('');
  function handleNewMessageChange(event) {
    console.log(event.target.value);
    setNewMessage(event.target.value);
  }
  function sendMessage(fucntioncode,data){
    if (fucntioncode.trim() !== '') {
      setMessages([...messages, fucntioncode.trim()]);
    }
  }
  function handleAddMessage() {
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage.trim()]);
      setNewMessage('');
    }
  }
  return (
    <div className="App">
    <UnityComponent parentCallBack={sendMessage}/>
    <LogBox messages={messages} />
        <input
          type="text"
          placeholder="Enter a message"
          value={newMessage}
          onChange={handleNewMessageChange}
        />
        <button onClick={handleAddMessage}>Add Message</button>
    </div>
  );
}

export default App;
