import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {readChat} from '../requests.ts';
import chat from '../../static/pages/chat/Chat.tsx';

export interface Message {
  userName: string;
  message: string;
  timeStamp: string;
}

export interface ChatType {
  chatId: string;
  userId: string;
  chatName: string;
  data: Message[] | [];
}

type ChatState = {
  list: ChatType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export const initialState: ChatState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchChats = createAsyncThunk('chats/fetchChats', async () => {
  const response = await readChat('');
  return response.data;
});

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addNewChat(state, action: PayloadAction<ChatType>) {
      state.list.push(action.payload);
    },
    deleteChatFromList(state, action: PayloadAction<string>) {
      state.list = state.list.filter(chat => chat.chatId !== action.payload);
    },
    addMessage(
      state,
      action: PayloadAction<{chatId: string; newMessage: Message}>,
    ) {
      const {chatId, newMessage} = action.payload;
      const chatIndex = state.list.findIndex(chat => chat.chatId === chatId);
      if (chatIndex !== -1) {
        (state.list[chatIndex].data as Message[]).push(newMessage);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchChats.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchChats.fulfilled,
        (state, action: PayloadAction<ChatType[]>) => {
          state.status = 'succeeded';
          state.list = action.payload;
        },
      )
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch movies';
      });
  },
});

export const {addNewChat, deleteChatFromList, addMessage} = chatsSlice.actions;
export default chatsSlice.reducer;
