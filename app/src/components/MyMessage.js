import React from "react";

import Moment from "react-moment";
// Component to represent a single message from current user
const MyMessage = ({ message, name, date, avatar }) => {
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
      <img src={avatar} className="w-9 h-9 bg-[#aaa] rounded-full cursor-pointer object-cover" />
    </div>
  );
};

export default MyMessage;
