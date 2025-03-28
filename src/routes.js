import Streams from '@pages/social/streams/Streams';
import { AuthTabs, ForgotPassword, ResetPassword } from './pages/auth';
import { useRoutes } from 'react-router-dom';
import ProtectedRoute from '@pages/ProtectedRoute';
import Error from '@pages/error/Error';
import { Suspense, lazy } from 'react';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';
import CardSkeleton from '@components/card-element/CardSkeleton';
import PhotoSkeleton from '@pages/social/photos/PhotoSkeleton';
import ProfileSkeleton from '@pages/social/profile/ProfileSkeleton';
import VideoSkeleton from '@pages/social/videos/VideoSkeleton';

const Social = lazy(() => import('@pages/social/Social'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const People = lazy(() => import('@pages/social/people/People'));
const Followers = lazy(() => import('@pages/social/followers/Followers'));
const Following = lazy(() => import('@pages/social/following/Following'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));
const Videos = lazy(() => import('@pages/social/videos/Videos'));
const Notifications = lazy(() => import('@pages/social/notifications/Notifications'));
const Profile = lazy(() => import('@pages/social/profile/Profile'));

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
        {
          path: 'streams',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <Streams />
            </Suspense>
          )
        },
        {
          path: 'chat/messages',
          element: (
            <Suspense>
              <Chat />
            </Suspense>
          )
        },
        {
          path: 'people',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <People />
            </Suspense>
          )
        },
        {
          path: 'followers',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Followers />
            </Suspense>
          )
        },
        {
          path: 'following',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Following />
            </Suspense>
          )
        },
        {
          path: 'photos',
          element: (
            <Suspense fallback={<PhotoSkeleton />}>
              <Photos />
            </Suspense>
          )
        },
        {
          path: 'videos',
          element: (
            <Suspense fallback={<VideoSkeleton />}>
              <Videos />
            </Suspense>
          )
        },
        {
          path: 'notifications',
          element: (
            <Suspense fallback={<NotificationSkeleton />}>
              <Notifications />
            </Suspense>
          )
        },
        {
          path: 'profile/:username',
          element: (
            <Suspense fallback={<ProfileSkeleton />}>
              <Profile />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '*',
      element: <Error />
    }
  ]);
  return elements;
};
