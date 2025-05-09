const axios = require('axios');

const createCometChatUser = async (user) => {
  try {
    const response = await axios.post(
      'https://2751954f990d97be.api-in.cometchat.io/v3/users',
      {
        uid: user._id,
        name: user.username,
        avatar: user.profilePicture || '', // fallback if missing
        metadata: {
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          postsCount: user.postsCount,
          avatarColor: user.avatarColor,
          social: user.social,
          notifications: user.notifications,
          createdAt: user.createdAt,
          '@private': {
            email: user.email,
            contactNumber: '' // If you have phone number, put it here
          }
        },
        tags: ['user'], // you can add more tags if needed
        withAuthToken: false
      },
      {
        headers: {
          appid: '2751954f990d97be',
          apikey: 'db3d6a6bc72155a917bd00068f16d70a2b76f1c3', // REST API Key
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    console.log('✅ CometChat user created:', response.data);
  } catch (error) {
    console.error('❌ Failed to create CometChat user:', error.response?.data || error.message);
  }
};

// Example call with your user object:
const user = {
  location: '',
  username: 'Admin',
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: ''
  },
  bgImageVersion: '',
  followersCount: 4,
  uId: '551679842710',
  school: '',
  blocked: [],
  notifications: {
    messages: true,
    reactions: true,
    comments: true,
    follows: true
  },
  email: 'armankhan8764@gmail.com',
  quote: '',
  avatarColor: '#009688',
  bgImageId: '',
  followingCount: 3,
  work: '',
  profilePicture: 'https://res.cloudinary.com/dpey3zzge/image/upload/v1746773281/67fe2addbc603f6669ea5cbf',
  _id: '67fe2addbc603f6669ea5cbf',
  postsCount: 0,
  createdAt: '2025-04-15T09:46:07.000Z',
  blockedBy: []
};

createCometChatUser(user);
