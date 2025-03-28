import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';
import '@components/posts/reactions/reactions-and-comments-display/ReactionsAndCommentsDisplay.scss';
import { Utils } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { postService } from '@services/api/post/post.service';
import { reactionsMap } from '@services/utils/static.data';
import { updatePostItem } from '@redux/reducers/post/post.reducer';
import { toggleCommentsModal, toggleReactionsModal } from '@redux/reducers/modal/modal.reducer';
import { Link } from 'react-router-dom';

const ReactionsAndCommentsDisplay = ({ post }) => {
  const { reactionsModalIsOpen, commentsModalIsOpen } = useSelector((state) => state.modal);
  const [postReactions, setPostReactions] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [postCommentNames, setPostCommentNames] = useState([]);
  const dispatch = useDispatch();

  const getPostReactions = async () => {
    try {
      const response = await postService.getPostReactions(post?._id);
      setPostReactions(response.data.reactions);
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  };

  const getPostCommentsNames = async () => {
    try {
      const response = await postService.getPostCommentsNames(post?._id);
      setPostCommentNames([...new Set(response.data.comments.names)]);
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  };

  const sumAllReactions = (reactions) => {
    if (reactions?.length) {
      const result = reactions.map((item) => item.value).reduce((prev, next) => prev + next);
      return Utils.shortenLargeNumbers(result);
    }
  };

  const openReactionsComponent = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleReactionsModal(!reactionsModalIsOpen));
  };

  const openCommentsComponent = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleCommentsModal(!commentsModalIsOpen));
  };

  useEffect(() => {
    setReactions(Utils.formattedReactions(post?.reactions));
  }, [post]);

  return (
    <div className="reactions-display">
      <div className="reaction">
        <div className="likes-block">
          <div className="likes-block-icons reactions-icon-display">
            {reactions.length > 0 &&
              reactions.map((reaction) => (
                <div className="tooltip-container" key={reaction?.type}>
                  <img
                    className="reaction-img"
                    src={`${reactionsMap[reaction?.type]}`}
                    alt=""
                    onMouseEnter={getPostReactions}
                  />
                  <div className="tooltip-container-text tooltip-container-bottom">
                    <p className="title">
                      <img className="title-img" src={`${reactionsMap[reaction?.type]}`} alt="" />
                      {reaction?.type.toUpperCase()}
                    </p>
                    <div className="likes-block-icons-list">
                      {postReactions.length === 0 && <FaSpinner className="circle-notch" />}
                      {postReactions.length && (
                        <>
                          {postReactions.slice(0, 19).map((postReaction) => (
                            <div key={Utils.generateString(10)}>
                              {postReaction?.type === reaction?.type && (
                                <Link to={`/app/social/profile/${postReaction?.username}`}>
                                  <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'center' }}>
                                    <img
                                      className="title-img"
                                      src={`${postReaction?.profilePicture}`}
                                      alt=""
                                      style={{
                                        height: '24px',
                                        width: '24px',
                                        borderRadius: '50%'
                                      }}
                                    />
                                    <span key={postReaction?._id}>{postReaction?.username}</span>
                                  </div>
                                </Link>
                              )}
                            </div>
                          ))}
                          {postReactions.length > 20 && <span>and {postReactions.length - 20} others...</span>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <span
            className="tooltip-container reactions-count"
            onMouseEnter={getPostReactions}
            onClick={() => openReactionsComponent()}
          >
            {sumAllReactions(reactions)}
            <div className="tooltip-container-text tooltip-container-likes-bottom">
              <div className="likes-block-icons-list">
                {postReactions.length === 0 && <FaSpinner className="circle-notch" />}
                {postReactions.length && (
                  <>
                    {postReactions.slice(0, 19).map((reaction) => (
                      <Link to={`/app/social/profile/${reaction?.username}`} key={Utils.generateString(10)}>
                        <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'center', cursor: 'pointer' }}>
                          <img
                            className="title-img"
                            src={`${reaction?.profilePicture}`}
                            alt=""
                            style={{
                              height: '24px',
                              width: '24px',
                              borderRadius: '50%'
                            }}
                          />
                          <span>{reaction?.username}</span>
                        </div>
                      </Link>
                    ))}
                    {postReactions.length > 20 && <span>and {postReactions.length - 20} others...</span>}
                  </>
                )}
              </div>
            </div>
          </span>
        </div>
      </div>
      <div className="comment tooltip-container" onClick={() => openCommentsComponent()}>
        {post?.commentsCount > 0 && (
          <span onMouseEnter={getPostCommentsNames}>
            {Utils.shortenLargeNumbers(post?.commentsCount)} {`${post?.commentsCount === 1 ? 'Comment' : 'Comments'}`}
          </span>
        )}
        <div className="tooltip-container-text tooltip-container-comments-bottom">
          <div className="likes-block-icons-list">
            {postCommentNames.length === 0 && <FaSpinner className="circle-notch" />}
            {postCommentNames.length && (
              <>
                {postCommentNames.slice(0, 19).map((names) => (
                  <span key={Utils.generateString(10)}>{names}</span>
                ))}
                {postCommentNames.length > 20 && <span>and {postCommentNames.length - 20} others...</span>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ReactionsAndCommentsDisplay.propTypes = {
  post: PropTypes.object
};

export default ReactionsAndCommentsDisplay;
