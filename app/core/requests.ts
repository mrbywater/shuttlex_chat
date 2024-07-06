import axios from 'axios';
import {CHAT_API_URL} from '../static/constants';
import {ChatType, Message} from './redux/chats.ts';

const createChatInstance = axios.create({
  baseURL: CHAT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createChat = (chatData: ChatType) =>
  createChatInstance.post('/', chatData);
export const readChat = (chatId: string) =>
  createChatInstance.get(`/${chatId}`);
export const updateChat = (chatId: string, chatData: Message) =>
  createChatInstance.put(`/${chatId}`, chatData);
export const deleteChat = (chatId: string) =>
  createChatInstance.delete(`/${chatId}`);
