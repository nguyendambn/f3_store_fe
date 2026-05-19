import { ThemeProvider } from "./contexts/theme-context.jsx";
import App from './App.jsx'
import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
const store = createStore(allReducer);
import allReducer from "./reducers/index.reducer.jsx";
import { Provider } from "react-redux";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider storageKey="theme">
        <App />
        
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);

