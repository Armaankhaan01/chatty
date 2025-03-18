import photo from '@assets/images/photo.png';
import gif from '@assets/images/gif.png';
import feeling from '@assets/images/feeling.png';
import Input from '@components/input/Input';
import { useRef } from 'react';

const ModalBoxSelection = () => {
  const fileInputRef = useRef();

  return (
    <div className="modal-box-selection" data-testid="modal-box-selection">
      <ul className="post-form-list" data-testid="list-item">
        <li className="post-form-list-item image-select">
          <Input name="image" ref={fileInputRef} type="file" className="file-input" />
          <img src={photo} alt="" /> Photo
        </li>
        <li className="post-form-list-item">
          <img src={gif} alt="" /> Gif
        </li>
        <li className="post-form-list-item">
          <img src={feeling} alt="" /> Feeling
        </li>
      </ul>
    </div>
  );
};
export default ModalBoxSelection;
