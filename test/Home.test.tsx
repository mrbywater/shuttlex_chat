import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'; // Импортируйте thunk таким образом
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {initialState as chatsInitialState} from '../app/core/redux/chats.ts';
import Home from '../app/static/pages/home/Home.tsx';

const middlewares = [thunk];
// @ts-ignore
const mockStore = configureStore(middlewares);

describe('Home Component', () => {
  let store: any;
  let mock: any;

  beforeEach(() => {
    store = mockStore({
      chats: chatsInitialState,
    });

    mock = new MockAdapter(axios);

    mock.onGet('/chats').reply(200, {
      data: [],
    });

    mock.onPost('/chats').reply(200, {
      chatId: 'new_chat_id',
      userId: 'user_id',
      chatName: 'Test Chat',
      data: [],
    });

    mock.onDelete('/chats/id').reply(200);
  });

  afterEach(() => {
    mock.restore();
  });

  test('renders correctly', () => {
    const {getByPlaceholderText, getByText} = render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    expect(getByPlaceholderText('Filter by name...')).toBeTruthy();
    expect(getByText('+')).toBeTruthy();
  });

  test('can add new chat', async () => {
    const {getByPlaceholderText, getByText} = render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    fireEvent.press(getByText('+'));

    fireEvent.changeText(getByPlaceholderText('Add title...'), 'Test Chat');

    fireEvent.press(getByText('ADD'));

    await waitFor(() => {
      expect(getByText('Test Chat')).toBeTruthy();
    });
  });
});
