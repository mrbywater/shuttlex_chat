import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Text,
  Modal,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {dismissKeyboard} from '../../../core/utils.ts';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../core/hooks/reduxHooks.ts';
import {RootState} from '../../../core/redux/store.ts';
import {
  addNewChat,
  ChatType,
  deleteChatFromList,
  fetchChats,
} from '../../../core/redux/chats.ts';
import {RootStackParamList} from '../../navigation/Navigator.tsx';
import {ActivityIndicator} from 'react-native-paper';
import {USER_ID} from '../../constants';
import uuid from 'react-native-uuid';
import {createChat, deleteChat} from '../../../core/requests.ts';

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  search: {
    width: '80%',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    width: 40,
    borderRadius: 100,
    fontSize: 15,
  },
  button: {
    fontSize: 30,
    lineHeight: 38,
  },
  chatsMainContainer: {
    marginVertical: 15,
  },
  chatsContainer: {
    backgroundColor: 'rgba(0,0,0, .2)',
    borderRadius: 15,
    marginVertical: 5,
    marginLeft: '5%',
    width: '90%',
    height: 40,
    flexDirection: 'row',
  },
  chatsText: {
    margin: 10,
  },
  modelContainer: {
    position: 'relative',
    backgroundColor: 'rgba(0,0,0, .8)',
    height: '100%',
    width: '100%',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelWindow: {
    backgroundColor: '#c2c2c2',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    height: 50,
    borderRadius: 10,
  },
  closeModel: {
    position: 'absolute',
    top: 15,
    right: 15,
    borderRadius: 10,
  },
  closeModelText: {
    fontSize: 20,
    color: '#c2c2c2',
  },
  modelWindowSearch: {
    width: '80%',
    marginHorizontal: 5,
  },
  deleteChatContainer: {
    width: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteChat: {
    fontSize: 28,
    transform: [{rotate: '45deg'}],
    marginLeft: 3,
  },
});

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const dispatch = useAppDispatch();
  const chats = useAppSelector((state: RootState) => state.chats.list);
  const status = useAppSelector((state: RootState) => state.chats.status);
  const errorR = useAppSelector((state: RootState) => state.chats.error);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [newChatName, setNewChatName] = useState<string>('');

  const modalHandler = () => setModalVisible(!modalVisible);
  const inputTextHandler = (setText: any) => (text: string) => setText(text);

  const deleteChatList = (chatId: string) => async () => {
    try {
      dispatch(deleteChatFromList(chatId));
      await deleteChat(chatId);
    } catch (error) {
      console.log('Error delete chat:', error);
    }
  };

  const addToChartList = async () => {
    try {
      const newChatId = uuid.v4();

      const newChat: ChatType = {
        chatId: `${newChatId}`,
        userId: USER_ID,
        chatName: newChatName,
        data: [],
      };
      if (newChatName.trim().length) {
        dispatch(addNewChat(newChat));
        setModalVisible(false);
        await createChat(newChat);
      }
    } catch (error) {
      console.log('Error creating new chat:', error);
    }
  };

  useEffect(() => {
    if (!modalVisible) {
      setNewChatName('');
    }
  }, [modalVisible]);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const filteredChats = chats.filter(chat => {
    return chat.chatName.toLowerCase().includes(searchText.toLowerCase());
  });

  const navigateToChat = (chatId: string) => () =>
    navigation.navigate('Chat', {chatId});

  if (status === 'loading') {
    return (
      <ActivityIndicator
        animating={true}
        size="large"
        color="#3f7bff"
        style={{flex: 1, alignItems: 'center'}}
      />
    );
  }

  if (status === 'failed') {
    return <Text>Error: {errorR}</Text>;
  }

  return (
    <TouchableWithoutFeedback
      onPress={dismissKeyboard}
      style={{height: '100%'}}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          placeholder="Filter by name..."
          value={searchText}
          onChangeText={inputTextHandler(setSearchText)}
        />
        <TouchableHighlight
          style={styles.buttonContainer}
          underlayColor="gray"
          onPress={modalHandler}>
          <Text style={styles.button}>+</Text>
        </TouchableHighlight>
      </View>
      <ScrollView style={styles.chatsMainContainer}>
        {filteredChats.map(item => (
          <View key={`chat_${item.chatId}`} style={styles.chatsContainer}>
            <TouchableHighlight
              underlayColor="gray"
              style={{borderRadius: 15, flex: 1}}
              onPress={navigateToChat(item.chatId)}>
              <Text style={styles.chatsText}>{item.chatName}</Text>
            </TouchableHighlight>
            {item.userId == USER_ID && (
              <TouchableHighlight
                underlayColor="gray"
                style={styles.deleteChatContainer}
                onPress={deleteChatList(item.chatId)}>
                <Text style={styles.deleteChat}>+</Text>
              </TouchableHighlight>
            )}
          </View>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={modalHandler}>
        <View style={styles.modelContainer}>
          <TouchableHighlight
            style={styles.closeModel}
            underlayColor="gray"
            onPress={modalHandler}>
            <Text style={styles.closeModelText}>Close</Text>
          </TouchableHighlight>
          <View style={styles.modelWindow}>
            <TextInput
              style={styles.modelWindowSearch}
              placeholder="Add title..."
              value={newChatName}
              onChangeText={inputTextHandler(setNewChatName)}
            />
            <Button title="ADD" onPress={addToChartList} />
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

export default Home;
