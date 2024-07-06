import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../pages/home/Home.tsx';
import Chat from '../pages/chat/Chat.tsx';

export type RootStackParamList = {
  Home: undefined;
  Chat: {chatId: string};
};

const Stack = createStackNavigator();

function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Chat List">
        <Stack.Screen name="Chat List" component={Home} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
