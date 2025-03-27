import PropTypes from 'prop-types';
import './Reactions.scss';
import { reactionsMap } from '@services/utils/static.data';

const Reactions = ({ handleClick, showLabel = true }) => {
  const reactionList = ['like', 'love', 'wow', 'happy', 'sad', 'angry'];

  return (
    <div className="reactions">
      <ul>
        {reactionList.map((reaction, index) => (
          <li key={index} onClick={() => handleClick(reaction)}>
            {showLabel && <label>{reaction}</label>}
            <img src={reactionsMap[reaction]} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

Reactions.propTypes = {
  handleClick: PropTypes.func,
  showLabel: PropTypes.bool
};

export default Reactions;
