import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
import Moment from "react-moment";

const Chat = () => {
  const user = useSelector((state) => state.Auth.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesList = useRef(null);

  // Component to represent a single message from other user
  const Message = ({ message, name, date }) => {
    return (
      <div className="flex flex-row gap-2  my-2 mx-1">
        <img src={user.avatar} className="w-9 h-9 bg-[#aaa] rounded-full cursor-pointer object-cover" />
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <div className="font-bold">{name}</div>
            <div className="text-[#BDBDBD]">
              <Moment format="hh:mm A">{date}</Moment>
            </div>
          </div>
          <div className="text-[#212325]">{message}</div>
        </div>
      </div>
    );
  };

  // Component to represent a single message from current user
  const MyMessage = ({ message, name, date }) => {
    return (
      <div className="flex flex-row gap-2 justify-end my-2 mx-1">
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <div className="font-bold">{name}</div>
            <div className="text-[#BDBDBD]">
              <Moment format="hh:mm A">{date}</Moment>
            </div>
          </div>
          <div className="text-[#212325]">{message}</div>
        </div>
        <img src={user.avatar} className="w-9 h-9 bg-[#aaa] rounded-full cursor-pointer object-cover" />
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      // fetch messages from server
      const { data, ok } = await api.get(`/chat/all`);
      ok && setMessages(data);
      // scroll to bottom of messages
      messagesList.current.scrollTop = messagesList.current.scrollHeight;
    })();
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
            return <MyMessage key={index} message={message.content} date={message.date} name={message.name} />;
          } else {
            return <Message key={index} message={message.content} date={message.date} name={message.name} />;
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
