import { ThemeProvider } from '@/hooks/useTheme';
import router from '@/routers/root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient();

root.render(
  <HelmetProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Tooltip
          noArrow={true}
          openEvents={{ mouseenter: true, click: true }}
          closeEvents={{ mouseleave: true, click: true }}
          globalCloseEvents={{ clickOutsideAnchor: true }}
          id="my-tooltip" />
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);
