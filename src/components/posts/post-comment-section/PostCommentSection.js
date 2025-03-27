import CommentArea from '@components/posts/comment-area/CommentArea';
import PropTypes from 'prop-types';
import ReactionsAndCommentsDisplay from '../reactions/reactions-and-comments-display/ReactionsAndCommentsDisplay';

const PostCommentSection = ({ post }) => {
  return (
    <div>
      <ReactionsAndCommentsDisplay post={post} />
      <CommentArea post={post} />
    </div>
  );
};

PostCommentSection.propTypes = {
  post: PropTypes.object
};

export default PostCommentSection;
