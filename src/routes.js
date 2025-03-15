import Streams from '@pages/social/streams/Streams';
import { AuthTabs, ForgotPassword, ResetPassword } from './pages/auth';
import { useRoutes } from 'react-router-dom';
import Social from '@pages/social/Social';
import Chat from '@pages/social/chat/Chat';
import People from '@pages/social/people/People';
import Followers from '@pages/social/followers/Followers';
import Following from '@pages/social/following/Following';
import Photos from '@pages/social/photos/Photos';
import Notifications from '@pages/social/notifications/Notifications';
import Profile from '@pages/social/profile/Profile';
import ProtectedRoute from '@pages/ProtectedRoute';

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
      element: (
        <ProtectedRoute>
          <Social />
        </ProtectedRoute>
      ),
      children: [
        { path: 'streams', element: <Streams /> },
        { path: 'chat/messages', element: <Chat /> },
        { path: 'people', element: <People /> },
        { path: 'followers', element: <Followers /> },
        { path: 'following', element: <Following /> },
        { path: 'photos', element: <Photos /> },
        { path: 'notifications', element: <Notifications /> },
        { path: 'profile/:username', element: <Profile /> }
      ]
    }
  ]);
  return elements;
};
