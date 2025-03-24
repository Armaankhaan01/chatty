import { useDispatch, useSelector } from 'react-redux';
import './Chat.scss';
import { getConversationList } from '@redux/api/chat';
import useEffectOnce from '@hooks/useEffectOnce';
import ChatList from '@components/chat/list/ChatList';

const Chat = () => {
  const { selectedChatUser, chatList } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(getConversationList());
  });

  return (
    <div className="private-chat-wrapper">
      <div className="private-chat-wrapper-content">
        <div className="private-chat-wrapper-content-side">
          <ChatList />
        </div>
        <div className="private-chat-wrapper-content-conversation">
          {(selectedChatUser || chatList.length > 0) && 'Chat window'}
          {!selectedChatUser && !chatList.length && (
            <div className="no-chat">Select or Search for users to chat with</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Chat;
