import { useRef } from 'react';
import './Stream.scss';
import Suggestions from '@components/suggestions/Suggestions';
import { useDispatch } from 'react-redux';
import { getUserSuggestions } from '@redux/api/suggestion';
import useEffectOnce from '@hooks/useEffectOnce';
import PostForm from '@components/posts/post-form/PostForm';

const Streams = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(getUserSuggestions());
  });

  return (
    <div className="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef} style={{ backgroundColor: 'white' }}>
          <PostForm />
          <div>Post Items</div>
          <div style={{ marginBottom: '50px', height: '50px' }} ref={bottomLineRef}></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};
export default Streams;
