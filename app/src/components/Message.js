import React from "react";

import Moment from "react-moment";
// Component to represent a single message from other user

const Message = ({ message, name, date, avatar }) => {
  return (
    <div className="flex flex-row gap-2  my-2 mx-1">
      <img src={avatar} className="w-9 h-9 bg-[#aaa] rounded-full cursor-pointer object-cover" />
      <div className="flex flex-col  bg-[#c5c5c5] text-white w-25 rounded-lg rounded-r-none p-2">
        <div className="flex flex-row gap-2">
          <div className="font-bold">{name}</div>
          <div className="text-white">
            <Moment format="hh:mm A">{date}</Moment>
          </div>
        </div>
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
};

export default Message;
