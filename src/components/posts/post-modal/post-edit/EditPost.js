import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import './EditPost.scss';
import PostWrapper from '@components/posts/modal-wrappers/post-wrapper/PostWrapper';
import ModalBoxContent from '../modal-box-content/ModalBoxContent';
import { bgColors, feelingsList } from '@services/utils/static.data';
import { PostUtils } from '@services/utils/post-utils.service';
import ModalBoxSelection from '../modal-box-content/ModalBoxSelection';
import Button from '@components/button/Button';
import { addPostFeeling, closeModal, toggleGifModal } from '@redux/reducers/modal/modal.reducer';
import PropTypes from 'prop-types';
import { ImageUtils } from '@services/utils/image-utils.service';
import Giphy from '@components/giphy/Giphy';
import Spinner from '@components/spinner/Spinner';
import { Utils } from '@services/utils/utils.service';

const EditPost = ({ selectedImage, selectedPostVideo }) => {
  const { gifModalIsOpen, feeling } = useSelector((state) => state.modal);
  const post = useSelector((state) => state.post);
  const { profile } = useSelector((state) => state.user);

  const imageInputRef = useRef(null);
  const inputRef = useRef(null);
  const counterRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [allowedNumberOfCharacters] = useState('500/500');
  const [hasVideo, setHasVideo] = useState(false);
  const [postImage, setPostImage] = useState('');
  const [textAreaBackground, setTextAreaBackground] = useState('#ffffff');
  const [selectedPostImage, setSelectedPostImage] = useState();
  const [selectedVideo, setSelectedVideo] = useState();
  const [disable, setDisable] = useState(true);
  const [postData, setPostData] = useState({
    post: '',
    bgColor: textAreaBackground,
    privacy: '',
    feelings: '',
    gifUrl: '',
    profilePicture: '',
    image: '',
    imgId: '',
    imgVersion: '',
    videoId: '',
    videoVersion: '',
    video: ''
  });

  const dispatch = useDispatch();
  const maxNumberOfCharacters = 500;

  const selectBackground = (bgColor) => {
    PostUtils.selectBackground(bgColor, postData, setTextAreaBackground, setPostData);
  };

  const onKeyDown = (event) => {
    const currentTextLength = event.target.textContent.length;
    if (currentTextLength === maxNumberOfCharacters && event.keyCode !== 8) {
      event.preventDefault();
    }
  };

  const postInputEditable = (event, textContent) => {
    const currentTextLength = event.target.textContent.length;
    const counter = maxNumberOfCharacters - currentTextLength;
    counterRef.current.textContent = `${counter}/500`;
    setDisable(currentTextLength <= 0 && !postImage);
    PostUtils.postInputEditable(textContent, postData, setPostData);
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  const clearImage = () => {
    setSelectedVideo(null);
    setHasVideo(false);
    PostUtils.clearImage(postData, '', inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData);
  };

  const getFeeling = useCallback(
    (name) => {
      const feeling = find(feelingsList, (data) => data.name === name);
      dispatch(addPostFeeling({ feeling }));
    },
    [dispatch]
  );

  const postInputData = useCallback(() => {
    setTimeout(() => {
      if (imageInputRef?.current) {
        postData.post = post?.post;
        imageInputRef.current.textContent = post?.post;
        setPostData(postData);
      }
    });
  }, [post, postData]);

  const editableFields = useCallback(() => {
    if (post?.feelings) {
      getFeeling(post?.feelings);
    }

    if (post?.bgColor) {
      postData.bgColor = post?.bgColor;
      setPostData(postData);
      setTextAreaBackground(post?.bgColor);
      setTimeout(() => {
        if (inputRef?.current) {
          postData.post = post?.post;
          inputRef.current.textContent = post?.post;
          setPostData(postData);
        }
      });
    }

    if (post?.gifUrl && !post?.imgId && post.videoId) {
      postData.gifUrl = post?.gifUrl;
      postData.videoId = '';
      postData.videoVersion = '';
      postData.imgId = '';
      postData.imgVersion = '';
      postData.video = '';
      postData.image = '';
      setPostImage(post?.gifUrl);
      setHasVideo(false);
      postInputData();
    }

    if (post?.imgId && !post?.gifUrl) {
      postData.imgId = post?.imgId;
      postData.imgVersion = post?.imgVersion;
      postData.videoId = '';
      postData.videoVersion = '';
      postData.video = '';
      const imageUrl = Utils.getImage(post?.imgId, post?.imgVersion);
      setPostImage(imageUrl);
      setHasVideo(false);
      postInputData();
    }

    if (post?.videoId && !post?.imgId && !post?.gifUrl) {
      postData.videoId = post?.videoId;
      postData.videoVersion = post?.videoVersion;
      postData.imgId = '';
      postData.imgVersion = '';
      postData.image = '';
      const videoUrl = Utils.getVideo(post?.videoId, post?.videoVersion);
      setPostImage(videoUrl);
      setHasVideo(true);
      postInputData();
    }
  }, [post, postData, getFeeling, postInputData]);

  const updatePost = async () => {
    setLoading(!loading);
    setDisable(!disable);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling?.name;
      }
      if (postData.gifUrl || (postData.imgId && postData.imgVersion)) {
        postData.bgColor = '#ffffff';
      }
      postData.privacy = post?.privacy || 'Public';
      postData.profilePicture = profile?.profilePicture;
      if (selectedPostImage || selectedVideo) {
        let result = '';
        if (selectedPostImage) {
          result = await ImageUtils.readAsBase64(selectedPostImage);
        }
        if (selectedVideo) {
          result = await ImageUtils.readAsBase64(selectedVideo);
        }
        const type = selectedPostImage ? 'image' : 'video';
        if (type === 'image') {
          postData.image = result;
          postData.video = '';
        } else {
          postData.image = '';
          postData.video = result;
        }
        postData.gifUrl = '';
        postData.imgId = '';
        postData.imgVersion = '';
        postData.videoId = '';
        postData.videoVersion = '';
        await PostUtils.sendUpdatePostWithFileRequest(type, post?._id, postData, setApiResponse, setLoading, dispatch);
      } else {
        setHasVideo(false);
        await PostUtils.sendUpdatePostRequest(post?._id, postData, setApiResponse, setLoading, dispatch);
      }
    } catch (error) {
      setHasVideo(false);
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResponse, setLoading, dispatch);
    }
  };

  useEffect(() => {
    PostUtils.positionCursor('editable');
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (imageInputRef?.current && imageInputRef?.current.textContent.length) {
        counterRef.current.textContent = `${maxNumberOfCharacters - imageInputRef?.current.textContent.length}/100`;
      } else if (inputRef?.current && inputRef?.current.textContent.length) {
        counterRef.current.textContent = `${maxNumberOfCharacters - inputRef?.current.textContent.length}/100`;
      }
    });
  }, []);

  useEffect(() => {
    if (!loading && apiResponse === 'success') {
      dispatch(closeModal());
    }
    setDisable(post?.post.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, post, postImage]);

  useEffect(() => {
    if (post?.gifUrl) {
      postData.image = '';
      postData.video = '';
      setSelectedPostImage(null);
      setSelectedVideo(null);
      setHasVideo(false);
      setPostImage(post?.gifUrl);
      PostUtils.postInputData(imageInputRef, postData, post?.post, setPostData);
    } else if (post?.image) {
      setPostImage(post?.image);
      setHasVideo(false);
      PostUtils.postInputData(imageInputRef, postData, post?.post, setPostData);
    } else if (post?.video) {
      setPostImage(post?.video);
      setHasVideo(true);
      PostUtils.postInputData(imageInputRef, postData, post?.post, setPostData);
    }
    editableFields();
  }, [editableFields, post, postData]);

  return (
    <PostWrapper>
      <div></div>
      {!gifModalIsOpen && (
        <div
          className="modal-box"
          style={{
            height:
              selectedPostImage || post?.gifUrl || post?.image || postData?.gifUrl || postData?.image ? '700px' : 'auto'
          }}
        >
          {loading && (
            <div className="modal-box-loading">
              <span>Posting...</span>
              <Spinner />
            </div>
          )}

          <div className="modal-box-header">
            <h2>Create Post</h2>
            <button className="modal-box-header-cancel" onClick={closePostModal}>
              x
            </button>
          </div>

          <hr />

          <ModalBoxContent />

          {!postImage && (
            <>
              <div
                className="modal-box-form"
                data-testid="modal-box-form"
                style={{ background: `${textAreaBackground}` }}
              >
                <div className="main" style={{ margin: textAreaBackground !== '#ffffff' ? '0 auto' : '' }}>
                  <div className="flex-row">
                    <div
                      data-testid="editable"
                      id="editable"
                      name="post"
                      ref={(el) => {
                        inputRef.current = el;
                        inputRef?.current?.focus();
                      }}
                      className={`editable flex-item ${textAreaBackground !== '#ffffff' ? 'textInputColor' : ''} ${
                        postData.post.length === 0 && textAreaBackground !== '#ffffff' ? 'defaultInputTextColor' : ''
                      }`}
                      contentEditable={true}
                      onInput={(e) => postInputEditable(e, e.currentTarget.textContent)}
                      onKeyDown={onKeyDown}
                      data-placeholder="What's on your mind?..."
                    ></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {postImage && (
            <>
              <div className="modal-box-image-form">
                <div
                  data-testid="post-editable"
                  name="post"
                  id="editable"
                  ref={(el) => {
                    imageInputRef.current = el;
                    imageInputRef?.current?.focus();
                  }}
                  className="post-input flex-item"
                  contentEditable={true}
                  onInput={(e) => postInputEditable(e, e.currentTarget.textContent)}
                  onKeyDown={onKeyDown}
                  data-placeholder="What's on your mind?..."
                ></div>
                <div className="image-display">
                  <div
                    className="image-delete-btn"
                    data-testid="image-delete-btn"
                    style={{ marginTop: `${hasVideo ? '-40px' : ''}` }}
                    onClick={() => clearImage()}
                  >
                    <FaTimes />
                  </div>
                  {!hasVideo && <img data-testid="post-image" className="post-image" src={`${postImage}`} alt="" />}
                  {hasVideo && (
                    <div style={{ marginTop: '-40px' }}>
                      <video width="100%" controls src={`${post?.video}`} />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="modal-box-bg-colors">
            <ul>
              {bgColors.map((color, index) => (
                <li
                  data-testid="bg-colors"
                  key={index}
                  className={`${color === '#ffffff' ? 'whiteColorBorder' : ''}`}
                  style={{ backgroundColor: `${color}` }}
                  onClick={() => {
                    PostUtils.positionCursor('editable');
                    selectBackground(color);
                  }}
                ></li>
              ))}
            </ul>
          </div>
          <span className="char_count" data-testid="allowed-number" ref={counterRef}>
            {allowedNumberOfCharacters}
          </span>

          <ModalBoxSelection setSelectedPostImage={setSelectedPostImage} setSelectedVideo={setSelectedVideo} />

          <div className="modal-box-button">
            <Button label="Post" className="post-button" disabled={disable} handleClick={updatePost} />
          </div>
        </div>
      )}
      {gifModalIsOpen && (
        <div className="modal-giphy">
          <div className="modal-giphy-header">
            <Button
              label={<FaArrowLeft />}
              className="back-button"
              disabled={false}
              handleClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}
            />
            <h2>Choose a GIF</h2>
          </div>
          <hr />
          <Giphy />
        </div>
      )}
      <div></div>
    </PostWrapper>
  );
};

EditPost.propTypes = {
  selectedImage: PropTypes.any,
  selectedPostVideo: PropTypes.any
};

export default EditPost;
