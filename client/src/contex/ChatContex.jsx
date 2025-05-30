import { useContext, createContext, useState } from "react";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [roomId, setRoomId] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const[connected, setconnected]= useState(false);
    return (
        <ChatContext.Provider value={{ roomId, currentUser, connected,setRoomId, setCurrentUser, setconnected }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
