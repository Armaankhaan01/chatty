import Avatar from '@components/avatar/Avatar';
import './Post.scss';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { timeAgo } from '@services/utils/timeago.utils';
import { feelingsList, privacyList } from '@services/utils/static.data';
import { Utils } from '@services/utils/utils.service';
import PostCommentSection from '../post-comment-section/PostCommentSection';
import ReactionsModal from '../reactions-modal/ReactionsModal';
import { useDispatch, useSelector } from 'react-redux';
import { find } from 'lodash';
import CommentInputBox from '../comments/comment-input/CommentInputBox';
import useLocalStorage from '@hooks/useLocalStorage';
import CommentsModal from '../comments/comments-modal/CommentsModal';
import { useEffect, useState } from 'react';
import ImageModal from '@components/image-modal/ImageModal';
import { ImageUtils } from '@services/utils/image-utils.service';
import Dialog from '@components/dialog/Dialog';
import { postService } from '@services/api/post/post.service';
import { openModal, toggleDeleteDialog } from '@redux/reducers/modal/modal.reducer';
import { clearPost, updatePostItem } from '@redux/reducers/post/post.reducer';

const Post = ({ post, showIcons }) => {
  const { reactionsModalIsOpen, commentsModalIsOpen, deleteDialogIsOpen } = useSelector((state) => state.modal);

  const selectedPost = useSelector((state) => state.post);
  const selectedPostId = useLocalStorage('selectedPostId', 'get');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [backgroundImageColor, setBackgroundImageColor] = useState('');
  const dispatch = useDispatch();
  const getFeeling = (name) => {
    const feeling = find(feelingsList, (data) => data.name === name);
    return feeling?.image;
  };

  const getPrivacy = (type) => {
    const privacy = find(privacyList, (data) => data.topText === type);
    return privacy?.icon;
  };

  const deletePost = async () => {
    try {
      const response = await postService.deletePost(selectedPost?._id);
      if (response) {
        Utils.dispatchNotification(response.data.message, 'success', dispatch);
        dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
        dispatch(clearPost());
      }
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const openPostModal = () => {
    dispatch(openModal({ type: 'edit' }));
    dispatch(updatePostItem(post));
  };

  const openDeleteDialog = () => {
    dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
    dispatch(updatePostItem(post));
  };

  const getBackgroundImageColor = async (post) => {
    let imageUrl = '';
    if (post?.imgId && !post?.gifUrl && post.bgColor === '#ffffff') {
      imageUrl = Utils.getImage(post.imgId, post.imgVersion);
    } else if (post?.gifUrl && post.bgColor === '#ffffff') {
      imageUrl = post?.gifUrl;
    }
    const bgColor = await ImageUtils.getBackgroundImageColor(imageUrl);
    setBackgroundImageColor(bgColor);
  };

  useEffect(() => {
    getBackgroundImageColor(post);
  }, [post]);

  return (
    <>
      {reactionsModalIsOpen && selectedPost?._id === post?._id && <ReactionsModal />}
      {commentsModalIsOpen && selectedPost?._id === post?._id && <CommentsModal />}
      {showImageModal && (
        <ImageModal image={`${imageUrl}`} onCancel={() => setShowImageModal(!showImageModal)} showArrow={false} />
      )}
      {deleteDialogIsOpen && (
        <Dialog
          title="Are you sure you want to delete this post?"
          firstButtonText="Delete"
          secondButtonText="Cancel"
          firstBtnHandler={() => deletePost()}
          secondBtnHandler={() => {
            dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
            dispatch(clearPost());
          }}
        />
      )}

      <div className="post-body">
        <div className="user-post-data">
          <div className="user-post-data-wrap">
            <div className="user-post-image">
              <Avatar
                name={post?.username}
                bgColor={post?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={post?.profilePicture}
              />
            </div>
            <div className="user-post-info">
              <div className="inline-title-display">
                <h5 data-testid="username">
                  {post?.username}
                  {post?.feelings && (
                    <div className="inline-display" data-testid="inline-display">
                      is feeling <img className="feeling-icon" src={`${getFeeling(post?.feelings)}`} alt="" />{' '}
                      <div>{post?.feelings}</div>
                    </div>
                  )}
                </h5>
                {showIcons && (
                  <div className="post-icons" data-testid="post-icons">
                    <FaPencilAlt className="pencil" onClick={openPostModal} />
                    <FaRegTrashAlt className="trash" onClick={openDeleteDialog} />
                  </div>
                )}
              </div>

              {post?.createdAt && (
                <p className="time-text-display" data-testid="time-display">
                  {timeAgo.transform(post?.createdAt)} &middot; {getPrivacy(post?.privacy)}
                </p>
              )}
            </div>
            <hr />
            <div className="user-post" style={{ marginTop: '1rem', borderBottom: '' }}>
              {post?.post && post?.bgColor === '#ffffff' && (
                <p className="post" data-testid="user-post">
                  {post?.post}
                </p>
              )}
              {post?.post && post?.bgColor !== '#ffffff' && (
                <div
                  data-testid="user-post-with-bg"
                  className="user-post-with-bg"
                  style={{ backgroundColor: `${post?.bgColor}` }}
                >
                  {post?.post}
                </div>
              )}
              {post?.imgId && !post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  data-testid="post-image"
                  className="image-display-flex"
                  style={{ height: '600px', backgroundColor: `${backgroundImageColor}` }}
                  onClick={() => {
                    setImageUrl(Utils.getImage(post.imgId, post.imgVersion));
                    setShowImageModal(!showImageModal);
                  }}
                >
                  <img
                    className="post-image"
                    style={{ objectFit: 'contain' }}
                    src={`${Utils.getImage(post.imgId, post.imgVersion)}`}
                    alt=""
                  />
                </div>
              )}
              {post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  className="image-display-flex"
                  style={{ height: '600px', backgroundColor: `${backgroundImageColor}` }}
                  onClick={() => {
                    setImageUrl(post?.gifUrl);
                    setShowImageModal(!showImageModal);
                  }}
                >
                  <img className="post-image" style={{ objectFit: 'contain' }} src={`${post?.gifUrl}`} alt="" />
                </div>
              )}
              {post?.videoId && post.bgColor === '#ffffff' && (
                <div
                  data-testid="post-image"
                  className="image-display-flex"
                  style={{ height: '600px', backgroundColor: '#000000' }}
                >
                  <video
                    width="100%"
                    height="600px"
                    autoPlay={true}
                    controls
                    src={`${Utils.getVideo(post.videoId, post.videoVersion)}`}
                  />
                </div>
              )}
              {(post?.reactions.length > 0 || post?.commentsCount > 0) && <hr />}
              <PostCommentSection post={post} />
            </div>
          </div>

          {selectedPost?._id === post?._id && selectedPostId && <CommentInputBox post={post} />}
        </div>
      </div>
    </>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  showIcons: PropTypes.bool
};

export default Post;
