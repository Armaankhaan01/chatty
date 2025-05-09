import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import './Chat.scss';
import { getConversationList } from '@redux/api/chat';
import useEffectOnce from '@hooks/useEffectOnce';
import ChatList from '@components/chat/list/ChatList';
import ChatWindow from '@components/chat/window/ChatWindow';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { setSelectedChatUser } from '@redux/reducers/chat/chat.reducer';

const Chat = () => {
  const { selectedChatUser, chatList } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [showChatList, setShowChatList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffectOnce(() => {
    dispatch(getConversationList());
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      // On mobile, if user has selected a chat, hide the chat list
      if (window.innerWidth < 768 && selectedChatUser) {
        setShowChatList(false);
      } else {
        setShowChatList(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedChatUser]);

  // When user selects a chat on mobile, hide the chat list
  useEffect(() => {
    if (isMobile && selectedChatUser) {
      setShowChatList(false);
    }
  }, [selectedChatUser, isMobile]);

  const toggleChatList = () => {
    setShowChatList(!showChatList);
    dispatch(setSelectedChatUser({ isLoading: false, user: '' }));
  };

  return (
    <div className="private-chat-wrapper">
      <div className="private-chat-wrapper-content">
        {/* Chat list section */}
        <div className={`private-chat-wrapper-content-side ${showChatList ? 'show' : 'hide'}`}>
          <ChatList />
        </div>

        {/* Chat window section */}
        <div className={`private-chat-wrapper-content-conversation ${!showChatList ? 'full-width' : ''}`}>
          {isMobile && selectedChatUser?.user && (
            <button className="toggle-chat-list" onClick={toggleChatList}>
              <FaArrowLeft />
            </button>
          )}

          {isMobile && !selectedChatUser?.user && !showChatList && (
            <button className="toggle-chat-list" onClick={toggleChatList}>
              <FaArrowRight />
            </button>
          )}

          {(selectedChatUser?.user || chatList.length > 0) && <ChatWindow />}
          {!selectedChatUser?.user && !chatList.length && (
            <div className="no-chat">Select or Search for users to chat with</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
