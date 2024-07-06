import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  chatListCardContainer: {
    backgroundColor: 'rgba(0,0,0, .1)',
    marginVertical: 7,
    padding: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  myChatListCardContainer: {
    backgroundColor: 'rgba(0,0,0, .1)',
    marginVertical: 7,
    padding: 5,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 10,
  },
  messageText: {
    marginVertical: 7,
  },
});

type ChatListCardProps = {
  name: string;
  message: string;
  isMy: boolean;
  timeStamp: string;
};

type OptionsType = {
  year: 'numeric' | '2-digit' | undefined;
  month: 'numeric' | '2-digit' | undefined;
  day: 'numeric' | '2-digit' | undefined;
  hour: 'numeric' | '2-digit' | undefined;
  minute: 'numeric' | '2-digit' | undefined;
  hour12: boolean;
};

const options: OptionsType = {
  year: 'numeric',
  month: '2-digit',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

const ChatListCard = (props: ChatListCardProps) => {
  const {name, message, isMy, timeStamp} = props;

  const dateObject = new Date(timeStamp);

  const formattedDateTime = dateObject.toLocaleDateString('en-US', options);

  return (
    <View
      style={
        !isMy ? styles.chatListCardContainer : styles.myChatListCardContainer
      }>
      <View style={isMy ? styles.myMessage : {}}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.date}>{formattedDateTime}</Text>
      </View>
    </View>
  );
};

export default ChatListCard;
