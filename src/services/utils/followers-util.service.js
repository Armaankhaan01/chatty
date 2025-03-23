import { followerService } from '@services/api/followers/follower.service';
import { Utils } from './utils.service';
import { socketService } from '@services/socket/socket.service';
import { cloneDeep, filter, find, findIndex } from 'lodash';

export class FollowersUtils {
  static async followUser(user, dispatch) {
    const response = await followerService.followUser(user?._id);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }

  static async unFollowUser(user, profile, dispatch) {
    const response = await followerService.unFollowUser(user?._id, profile?._id);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }

  static socketIOFollowAndUnfollow(users, followers, setFollowers, setUsers) {
    socketService?.socket?.on('add follower', (data) => {
      const userData = find(users, (user) => user._id === data?._id);
      if (userData) {
        const updatedFollowers = [...followers, data];
        setFollowers(updatedFollowers);
        FollowersUtils.updateSingleUser(users, userData, data, setUsers);
      }
    });

    socketService?.socket?.on('remove follower', (data) => {
      const userData = find(users, (user) => user._id === data?._id);
      if (userData) {
        const updatedFollowers = filter(followers, (follower) => follower._id !== data?._id);
        setFollowers(updatedFollowers);
        FollowersUtils.updateSingleUser(users, userData, data, setUsers);
      }
    });
  }

  static updateSingleUser(users, userData, followerData, setUsers) {
    users = cloneDeep(users);
    userData.followersCount = followerData.followersCount;
    userData.followingCount = followerData.followingCount;
    userData.postsCount = followerData.postsCount;
    const index = findIndex(users, ['_id', userData?._id]);
    if (index > -1) {
      users.splice(index, 1, userData);
      setUsers(users);
    }
  }
}
