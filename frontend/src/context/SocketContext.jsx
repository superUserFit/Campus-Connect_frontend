import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";
import { useRecoilState } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";


const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [isTyping, setIsTyping] = useState(false);
	const user = useRecoilValue(userAtom);
	const [selectedConversation] = useRecoilState(selectedConversationAtom);

	useEffect(() => {
		const newSocket = io("http://13.212.151.208:3000/", {
			query: {
				userId: user?._id,
			},
		});

		setSocket(newSocket);

		newSocket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
			console.log("Online Users in Socket Provider: ", users);
		});

		return () => {
			newSocket && newSocket.disconnect();
		};
	}, [user?._id]);

	useEffect(() => {
		if (!socket) return;

		socket.on("typing", ({ conversationId, userId }) => {
			setIsTyping(userId !== user?._id && conversationId === selectedConversation._id);
			console.log("IsTyping: ", isTyping);
		});

		return () => {
			socket.off("typing");
		};
	}, [socket, user?._id, selectedConversation._id]);

	return <SocketContext.Provider value={{ socket, onlineUsers, isTyping }}>{children}</SocketContext.Provider>;
};
