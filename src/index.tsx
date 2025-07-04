import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import Tooltip from './commons/Tooltip';
import './index.css';
import reportWebVitals from './reportWebVitals';
import router from './routers/root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <Tooltip />
  </QueryClientProvider>
);

reportWebVitals();
