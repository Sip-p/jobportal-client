import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋, how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
const {backendUrl}=useContext(AppContext)
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const { data } = await axios.post(backendUrl + "/api/chat",{
        message: input
      });
console.log("Chatbot response:", data);
      setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "Error with chatbot." }]);
    }

    setInput("");
  };

  return (
    <>      <button className=" fixed chatbot-icon bg-gradient-to-r from-purple-800 to-purple-950   p-2 bottom-2 right-2   h-10 w-10 rounded-lg " onClick={()=>{
      document.querySelector('.chatbot').classList.remove('hidden')
      document.querySelector('.chatbot-icon').classList.add('hidden')
    }}>💬</button>
 
    <div className=" chatbot fixed bottom-4 right-4 w-80 bg-black shadow-lg rounded-lg p-3 hidden ">
       <button className="bg-white  right-2 top-2 p-1 rounded-full absolute" onClick={()=>{
        document.querySelector('.chatbot').classList.add('hidden')
        document.querySelector('.chatbot-icon').classList.remove('hidden')
      }}>
        <img src= {assets.cross_icon}/>
        </button>
      <div className="h-64 overflow-y-auto mb-2 border-b">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-1 ${
              msg.sender === "bot" ? "text-left" : "text-right"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.sender === "bot"
                  ? "bg-gray-200 text-black"
                  : "bg-blue-500 text-white"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input type="file" className="hidden bg-white"/>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-l-lg bg-white"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
    </>
  );
};

export default ChatBot;
