import { useEffect, useState } from 'react';
import {
  CometChatUIKit,
  UIKitSettingsBuilder,
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer
} from '@cometchat/chat-uikit-react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import '@cometchat/chat-uikit-react/css-variables.css';

// Environment variables configuration
const COMETCHAT_CONSTANTS = {
  APP_ID: process.env.REACT_APP_COMETCHAT_CONSTANTS_APP_ID,
  REGION: process.env.REACT_APP_COMETCHAT_CONSTANTS_REGION,
  AUTH_KEY: process.env.REACT_APP_COMETCHAT_CONSTANTS_AUTH_KEY
};

// Replace this with actual user UID
const UID = '67fe2addbc603f6669ea5cbf';

const Chat = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [selectedGroup, setSelectedGroup] = useState(undefined);

  // Initialize CometChat
  useEffect(() => {
    const initCometChat = async () => {
      // Validate environment variables
      if (!COMETCHAT_CONSTANTS.APP_ID || !COMETCHAT_CONSTANTS.REGION || !COMETCHAT_CONSTANTS.AUTH_KEY) {
        setError('Missing CometChat environment variables. Please check your .env file.');
        return;
      }

      try {
        // Configure CometChat settings
        const UIKitSettings = new UIKitSettingsBuilder()
          .setAppId(COMETCHAT_CONSTANTS.APP_ID)
          .setRegion(COMETCHAT_CONSTANTS.REGION)
          .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
          .subscribePresenceForAllUsers()
          .build();

        // Initialize CometChat
        await CometChatUIKit.init(UIKitSettings);
        console.log('CometChat UI Kit initialized successfully');
        setIsInitialized(true);
      } catch (err) {
        console.error('CometChat initialization failed:', err);
        setError(`CometChat initialization failed: ${err.message}`);
      }
    };

    initCometChat();

    // Cleanup function
    return () => {
      // Optional: Add cleanup logic if needed
    };
  }, []);

  // Login to CometChat after initialization
  useEffect(() => {
    const loginUser = async () => {
      if (!isInitialized) return;

      try {
        // Check if user is already logged in
        const user = await CometChatUIKit.getLoggedinUser();

        if (user) {
          console.log('User already logged in:', user);
          setIsLoggedIn(true);
        } else {
          // Login with UID
          const loggedInUser = await CometChatUIKit.login(UID);
          console.log('Login successful:', loggedInUser);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('CometChat login failed:', err);
        setError(`CometChat login failed: ${err.message}`);
      }
    };

    loginUser();
  }, [isInitialized]);

  // Handle conversation selection
  const handleItemClick = (activeItem) => {
    let item = activeItem;

    // If the selected item is a conversation, extract the user/group from it
    if (activeItem instanceof CometChat.Conversation) {
      item = activeItem.getConversationWith();
    }

    // Determine if the selected item is a User or a Group and update the state accordingly
    if (item instanceof CometChat.User) {
      setSelectedUser(item);
      setSelectedGroup(undefined); // Ensure no group is selected
    } else if (item instanceof CometChat.Group) {
      setSelectedUser(undefined); // Ensure no user is selected
      setSelectedGroup(item);
    } else {
      setSelectedUser(undefined);
      setSelectedGroup(undefined); // Reset if selection is invalid
    }
  };

  // Render loading state
  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f3f4f6'
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#dc2626',
              marginBottom: '0.5rem'
            }}
          >
            Error
          </h2>
          <p style={{ color: '#4b5563' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f3f4f6'
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}
          >
            Loading CometChat...
          </h2>
          <div
            style={{
              width: '100%',
              backgroundColor: '#e5e7eb',
              borderRadius: '9999px',
              height: '0.625rem'
            }}
          >
            <div
              style={{
                backgroundColor: '#2563eb',
                height: '0.625rem',
                borderRadius: '9999px',
                width: '50%'
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Render CometChat component with the layout similar to App.js in the demo
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Conversations sidebar */}
      <div
        style={{
          width: '320px',
          borderRight: '1px solid #e5e7eb'
        }}
      >
        <CometChatConversations onItemClick={handleItemClick} />
      </div>

      {/* Chat area */}
      {selectedUser || selectedGroup ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {/* Message header */}
          <CometChatMessageHeader user={selectedUser} group={selectedGroup} />

          {/* Message list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <CometChatMessageList user={selectedUser} group={selectedGroup} />
          </div>

          {/* Message composer */}
          <CometChatMessageComposer user={selectedUser} group={selectedGroup} />
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            color: '#6b7280',
            fontSize: '1.125rem'
          }}
        >
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
};

export default Chat;
