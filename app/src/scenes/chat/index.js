import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
import MyMessage from "../../components/MyMessage";
import Message from "../../components/Message";
import Moment from "react-moment";
import io from "socket.io-client";
const socket = io("http://localhost:8090");

const Chat = () => {
  const user = useSelector((state) => state.Auth.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesList = useRef(null);
  let currentDate = new Date("August 19, 1975 23:15:30").toDateString();

  useEffect(() => {
    // Fetch messages from server and scroll to bottom of messages list on load and every 60 seconds
    const fetchMessages = async () => {
      const { data, ok } = await api.get(`/chat/all`);
      ok && setMessages(data);
    };
    fetchMessages();
    messagesList.current.scrollTop = messagesList.current.scrollHeight;
  }, []);

  useEffect(() => {
    socket.emit("join", user.organisation);
    // Listen for new messages from server
    socket.on("receive message", ({ message }) => {
      setMessages([...messages, message]);
    });

    return () => {
      socket.off("receive message");
      socket.off("join");
    };
  }, [messages]);

  // Send message to server
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data, ok } = await api.post(`/chat/new`, { content: newMessage });
    ok && socket.emit("messages", { message: data });
    // clear input field and scroll to bottom of messages
    messagesList.current.scrollTop = messagesList.current.scrollHeight;
    setNewMessage("");
  };

  // Render message based on if it's from the current user or not
  function RenderMessage(message, index) {
    return (
      <div key={index}>
        {message.name === user.name ? (
          <MyMessage message={message.content} date={message.date} name={message.name} avatar={message.avatar} />
        ) : (
          <Message message={message.content} date={message.date} name={message.name} avatar={message.avatar} />
        )}
      </div>
    );
  }

  return (
    <div className="px-2 md:!px-8 flex flex-col md:fex-column gap-5 mt-5 h-5/6">
      <ul ref={messagesList} className="flex-1 border-8 border-r-8 bg-white shadow-md overflow-y-auto m-0 p-0 list-none flex flex-col h-64">
        {messages?.map((message, index) => {
          let dateMessage = new Date(message.date).toDateString();
          if (dateMessage !== currentDate) {
            currentDate = new Date(message.date).toDateString();
            return (
              <>
                <p className="text-center text-gray-600">
                  <Moment format="MMM Do YY">{currentDate}</Moment>
                </p>
                {RenderMessage(message, index)}
              </>
            );
          } else {
            return RenderMessage(message, index);
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
