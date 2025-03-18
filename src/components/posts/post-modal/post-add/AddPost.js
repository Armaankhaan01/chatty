import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import './AddPost.scss';
import PostWrapper from '@components/posts/modal-wrappers/post-wrapper/PostWrapper';
import ModalBoxContent from '../modal-box-content/ModalBoxContent';
import { bgColors } from '@services/utils/static.data';
import { PostUtils } from '@services/utils/post-utils.service';
import ModalBoxSelection from '../modal-box-content/ModalBoxSelection';
import Button from '@components/button/Button';

const AddPost = () => {
  const { gifModalIsOpen } = useSelector((state) => state.modal);
  const [loading] = useState(false);
  const [postImage] = useState('');
  const [allowedNumberOfCharacters] = useState('100/100');
  const [textAreaBackground, setTextAreaBackground] = useState('#ffffff');
  const [postData, setPostData] = useState({
    post: '',
    bgColor: textAreaBackground,
    privacy: '',
    feelings: '',
    gifUrl: '',
    profilePicture: '',
    image: '',
    video: ''
  });
  const [disable, setDisable] = useState(false);

  const maxNumberOfCharacters = 100;

  const counterRef = useRef(null);

  const selectBackground = (bgColor) => {
    PostUtils.selectBackground(bgColor, postData, setTextAreaBackground, setPostData);
  };

  const onKeyDown = (event) => {
    const currentTextLength = event.target.textContent.length;
    if (currentTextLength === maxNumberOfCharacters && event.keyCode !== 8) {
      event.preventDefault();
    }
  };

  return (
    <PostWrapper>
      <div></div>
      {!gifModalIsOpen && (
        <div className="modal-box">
          {loading && (
            <div className="modal-box-loading">
              <span>Posting...</span>
            </div>
          )}
          <div className="modal-box-header">
            <h2>Create Post</h2>
            <button className="modal-box-header-cancel">x</button>
          </div>
          <hr />
          <ModalBoxContent />
          {!postImage && (
            <>
              <div className="modal-box-form" style={{ background: `${textAreaBackground}` }}>
                <div className="main" style={{ margin: textAreaBackground !== '#ffffff' ? '0 auto' : '' }}>
                  <div className="flex-row">
                    <div
                      className={`editable flex-item ${textAreaBackground !== '#ffffff' ? 'textInputColor' : ''}`}
                      id="editable"
                      name="post"
                      contentEditable={true}
                      data-placeholder="What's on your mind"
                      onKeyDown={onKeyDown}
                    ></div>
                  </div>
                </div>
              </div>
            </>
          )}
          {postImage && (
            <>
              <div className="modal-box-image-form">
                <div className="main">
                  <div className="flex-row">
                    <div
                      className="editable flex-items"
                      name="post"
                      contentEditable={true}
                      data-placeholder="What's on your mind"
                      onKeyDown={onKeyDown}
                    ></div>
                    <div className="image-display">
                      <div className="image-delete-btn">
                        <FaTimes />
                      </div>
                      <img src="" className="post-image" alt="" />
                    </div>
                  </div>
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
                    selectBackground(color);
                  }}
                ></li>
              ))}
            </ul>
          </div>
          <span className="char_count" data-testid="allowed-number" ref={counterRef}>
            {allowedNumberOfCharacters}
          </span>

          <ModalBoxSelection />

          <div className="modal-box-button">
            <Button label="Post" className="post-button" disabled={disable} />
          </div>
        </div>
      )}
      {gifModalIsOpen && <div>Gif</div>}
      <div></div>
    </PostWrapper>
  );
};
export default AddPost;
