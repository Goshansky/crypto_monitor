import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../types/types"; // Импортируем тип ChatMessage

interface ChatState {
    messages: ChatMessage[];
}

const initialState: ChatState = {
    messages: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
            console.log("Message added to Redux state:", action.payload);
        },
    },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;





