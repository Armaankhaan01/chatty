import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';

const EmojiPicker = ({ onEmojiClick, pickerStyle }) => (
  <div className="emoji-picker">
    <Picker
      onEmojiClick={(emojiObject) => {
        onEmojiClick({ emoji: emojiObject.emoji });
      }}
      lazyLoadEmojis={true}
      native={true}
      previewConfig={{ showPreview: false }}
      pickerStyle={pickerStyle}
    />
  </div>
);

EmojiPicker.propTypes = {
  onEmojiClick: PropTypes.func,
  pickerStyle: PropTypes.object
};

export default EmojiPicker;
