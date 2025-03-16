import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store.tsx";
import { addMessage } from "../../features/chatSlice";
import { MessageType, SystemMessageType } from "../../types/types";
import { Message } from "../Message";
import styles from "./Chat.module.css";

export default function Chat() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [inputText, setInputText] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");
    const dispatch = useDispatch();
    const messages = useSelector((state: RootState) => state.chat.messages);

    useEffect(() => {
        const chat = io("wss://89.169.168.253:4500", {
            transports: ["websocket", "polling"],
        });

        chat.on("connect", () => {
            setSocket(chat);
            console.log("connected to chat");
        });

        chat.on("disconnect", () => {
            setSocket(null);
            console.log("disconnected from chat");
            dispatch(
                addMessage({
                    type: "system",
                    data: {
                        text: "You were disconnected from chat!",
                        timestamp: new Date().toISOString(),
                    },
                })
            );
        });

        chat.on("system", (systemMsg: SystemMessageType) => {
            dispatch(
                addMessage({
                    type: "system",
                    data: systemMsg,
                })
            );
        });

        chat.on("message", (msg: MessageType) => {
            dispatch(
                addMessage({
                    type: "message",
                    data: msg,
                })
            );
        });

        return () => {
            chat.disconnect();
        };
    }, [dispatch]);

    const sendMessage = useCallback(async () => {
        if (!socket || !inputText.trim()) return;
        if (inputText.startsWith("/name ")) {
            const nn = inputText.substring("/name ".length).trim();
            if (!nn) return;
            setNickname(nn);
            socket.emit("set_username", { username: nn });
        } else {
            if (!nickname) {
                alert(
                    "Там короче нужно в начале `/name` прописать"
                );
                setInputText("/name ");
                return;
            }
            const message: MessageType = {
                text: inputText.trim(),
                username: nickname,
                timestamp: new Date().toISOString(),
            };
            socket.emit("message", message);
            setInputText("");
        }
    }, [socket, inputText, nickname]);

    return (
        <div className={styles.chatContainer}>
            <h3>Chat</h3>
            <div className={styles.messageList}>
                {messages.map((msg, i) => (
                    <Message key={"chat-message-no-" + i} type={msg.type} data={msg.data} />
                ))}
            </div>
            <div className={styles.inputContainer}>
                <textarea
                    className={styles.textarea}
                    onChange={(e) => setInputText(e.target.value)}
                    value={inputText}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} disabled={!inputText.trim()} className={styles.sendButton}>
                    Send
                </button>
            </div>
        </div>
    );
}















