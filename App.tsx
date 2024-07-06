import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Navigator from './app/static/navigation/Navigator.tsx';
import {Provider} from 'react-redux';
import {store} from './app/core/redux/store.ts';
import {PaperProvider} from 'react-native-paper';

function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <GestureHandlerRootView>
          <SafeAreaProvider>
            <Navigator />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </Provider>
  );
}

export default App;
