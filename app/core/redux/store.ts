import {configureStore} from '@reduxjs/toolkit';
import chats from './chats';

export const store = configureStore({
  reducer: {
    chats,
  },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
