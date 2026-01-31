
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { Provider } from 'react-redux';


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);