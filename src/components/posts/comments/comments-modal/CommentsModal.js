import Avatar from '@components/avatar/Avatar';
import ReactionWrapper from '@components/posts/modal-wrappers/reaction-wrapper/ReactionWrapper';
import useEffectOnce from '@hooks/useEffectOnce';
import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { clearPost } from '@redux/reducers/post/post.reducer';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';
import { useState } from 'react';
import './CommentsModal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CommentsModal = () => {
  const post = useSelector((state) => state.post);
  const [postComments, setPostComments] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const dispatch = useDispatch();

  const getPostComments = async () => {
    try {
      const response = await postService.getPostComments(post?._id);
      setPostComments(response.data?.comments);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const toggleExpand = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const closeCommentsModal = () => {
    dispatch(closeModal());
    dispatch(clearPost());
  };

  useEffectOnce(() => {
    getPostComments();
  });

  return (
    <>
      <ReactionWrapper closeModal={closeCommentsModal}>
        <div className="modal-comments-header">
          <h2>Comments</h2>
        </div>
        <div className="modal-comments-container">
          <ul className="modal-comments-container-list">
            {postComments.map((data) => {
              const isLongComment = data?.comment.length > 200;
              const showFullComment = expandedComments[data?._id];

              return (
                <li className="modal-comments-container-list-item" key={data?._id}>
                  <div className="modal-comments-container-list-item-display">
                    <div className="user-img">
                      <Avatar
                        name={data?.username}
                        bgColor={data?.avatarColor}
                        textColor="#ffffff"
                        size={45}
                        avatarSrc={data?.profilePicture}
                      />
                    </div>
                    <div className="modal-comments-container-list-item-display-block">
                      <div className="comment-data">
                        <Link
                          to={`/app/social/profile/${data?.username}`}
                          onClick={closeCommentsModal}
                          style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'inherit' }}
                        >
                          <h1>{data?.username}</h1>
                        </Link>
                        <p>
                          {showFullComment
                            ? data?.comment
                            : `${data?.comment.slice(0, 200)}${isLongComment ? '...' : ''}`}
                        </p>
                        {isLongComment && (
                          <span
                            className="read-more-btn"
                            onClick={(e) => {
                              toggleExpand(data?._id);
                            }}
                          >
                            {showFullComment ? 'Show less' : 'Read more'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </ReactionWrapper>
    </>
  );
};

export default CommentsModal;
