import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
import Moment from "react-moment";
import MyMessage from "../../components/MyMessage";
import Message from "../../components/Message";
const Chat = () => {
  const user = useSelector((state) => state.Auth.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesList = useRef(null);

  useEffect(() => {
    // Fetch messages from server and scroll to bottom of messages list on load and every 60 seconds
    const fetchMessages = async () => {
      const { data, ok } = await api.get(`/chat/all`);
      ok && setMessages(data);
    };
    messagesList.current.scrollTop = messagesList.current.scrollHeight;
    fetchMessages();

    const interval = setInterval(fetchMessages, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (event) => {
    // Send message to server
    event.preventDefault();
    const { data, ok } = await api.post(`/chat/new`, { content: newMessage });
    ok && setMessages([...messages, data]);

    // clear input field and scroll to bottom of messages
    messagesList.current.scrollTop = messagesList.current.scrollHeight;
    setNewMessage("");
  };

  return (
    <div className="px-2 md:!px-8 flex flex-col md:fex-column gap-5 mt-5 h-50">
      <ul ref={messagesList} className="flex-1 border-8 border-r-8 bg-white shadow-md overflow-y-auto m-0 p-0 list-none flex flex-col h-64">
        {messages?.map((message, index) => {
          if (message.name === user.name) {
            return <MyMessage key={index} message={message.content} date={message.date} name={message.name} avatar={message.avatar} />;
          } else {
            return <Message key={index} message={message.content} date={message.date} name={message.name} avatar={message.avatar} />;
          }
        })}
      </ul>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder="Type your message..."
        />
        <button className="px-4 py-2 rounded-xl bg-[#0560FD] text-white mt-2" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
