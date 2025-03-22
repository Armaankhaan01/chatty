import Avatar from '@components/avatar/Avatar';
import { reactionsMap } from '@services/utils/static.data';
import { Utils } from '@services/utils/utils.service';
import PropTypes from 'prop-types';

import './ReactionList.scss';
import { Link } from 'react-router-dom';

const ReactionList = ({ postReactions }) => {
  return (
    <div className="modal-reactions-container">
      {postReactions.map((reaction) => (
        <Link
          to={`/app/social/profile/${reaction?.username}`}
          key={Utils.generateString(10)}
          style={{ textDecoration: 'none' }}
        >
          <div className="modal-reactions-container-list">
            <div className="img">
              <Avatar
                name={reaction?.username}
                bgColor={reaction?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={reaction?.profilePicture}
              />
              <img src={`${reactionsMap[reaction?.type]}`} alt="" className="reaction-icon" />
            </div>
            <span>{reaction?.username}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

ReactionList.propTypes = {
  postReactions: PropTypes.array
};

export default ReactionList;
