// index.js

import { AppRegistry } from 'react-native';
import App from './App';
import appConfig from './app.json'; // Importa la configuración de la aplicación desde app.json

// Obtiene el nombre de la aplicación desde la configuración de la aplicación
const { name: appName } = appConfig.expo;

// Registrar la aplicación
AppRegistry.registerComponent(appName, () => App);

// Iniciar la aplicación
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
