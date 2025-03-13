import Streams from '@pages/social/streams/Streams';
import { AuthTabs, ForgotPassword, ResetPassword } from './pages/auth';
import { useRoutes } from 'react-router-dom';
import Social from '@pages/social/Social';

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: '/',
      element: <AuthTabs />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/app/social',
      element: <Social />,
      children: [{ path: 'streams', element: <Streams /> }]
    }
  ]);
  return elements;
};
