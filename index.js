import { AppRegistry } from 'react-native';
import App from './App'; // ✅ Make sure it says App.js, not App.tsx
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
