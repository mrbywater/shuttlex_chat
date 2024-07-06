import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ChatListCard from '../../../shared/ChatListCard/ChatListCard.tsx';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/Navigator.tsx';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../core/hooks/reduxHooks.ts';
import {RootState} from '../../../core/redux/store.ts';
import {useEffect, useRef, useState} from 'react';
import {USER_NAME} from '../../constants';
import {addMessage} from '../../../core/redux/chats.ts';
import {updateChat} from '../../../core/requests.ts';

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTopWidth: 1,
    height: 50,
    borderTopColor: 'gray',
  },
  input: {
    paddingRight: 40,
    paddingLeft: 10,
  },
  sendButton: {
    position: 'absolute',
    top: -5,
    right: 10,
    fontSize: 20,
  },
  chatBoardContainer: {
    flex: 1,
    marginBottom: 60,
    marginTop: 10,
  },
  chatBoard: {
    paddingHorizontal: 10,
  },
});

type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const Chat = () => {
  const route = useRoute<ChatRouteProp>();
  const {chatId} = route.params;

  const scrollViewRef = useRef<ScrollView>(null);

  const dispatch = useAppDispatch();
  const chats = useAppSelector((state: RootState) => state.chats.list);

  const [messageValue, setMessageValue] = useState<string>('');

  const selectedChat = chats.find(chat => chat.chatId === chatId);
  const messageValueHandler = () => (text: string) => setMessageValue(text);
  const sendMessage = (message: string) => async () => {
    try {
      const newMessage = {
        userName: USER_NAME,
        message: message,
        timeStamp: new Date() + '',
      };

      if (message.trim().length) {
        dispatch(addMessage({chatId, newMessage}));
        setMessageValue('');
        await updateChat(chatId, newMessage);
      }
    } catch (error) {
      console.log('Error update chat:', error);
    }
  };

  const sortedMessage = selectedChat?.data
    .slice()
    .sort(
      (a, b) =>
        new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime(),
    );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [selectedChat]);

  // const [socket, setSocket] = useState<WebSocket | null>(null);
  //
  // useEffect(() => {
  //   const ws = new WebSocket('ws://your-websocket-url');
  //
  //   ws.onopen = () => {
  //     console.log('WebSocket connection established.');
  //   };
  //
  //   ws.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };
  //
  //   ws.onmessage = (event) => {
  //     console.log('Received message:', event.data);
  //   };
  //
  //   setSocket(ws);
  //
  //   return () => {
  //     ws.close();
  //   };
  // }, []);
  //
  // const sendMessageSocket = () => {
  //   if (socket) {
  //     socket.send('Hello WebSocket!');
  //   }
  // };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.chatBoardContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatBoard}
          contentContainerStyle={{justifyContent: 'flex-end'}}>
          {sortedMessage?.map((message, index) => (
            <ChatListCard
              key={index}
              timeStamp={message.timeStamp + ''}
              name={message.userName}
              message={message.message}
              isMy={message.userName === USER_NAME}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageValue}
          onChangeText={messageValueHandler()}></TextInput>
        <TouchableHighlight underlayColor="gray" style={styles.sendButton}>
          <Text
            style={
              messageValue.trim().length
                ? {fontSize: 40, color: '#74a1ff'}
                : {fontSize: 40}
            }
            onPress={sendMessage(messageValue)}>
            +
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Chat;
