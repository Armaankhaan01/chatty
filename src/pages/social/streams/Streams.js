import { useEffect, useRef, useState } from 'react';
import './Stream.scss';
import Suggestions from '@components/suggestions/Suggestions';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSuggestions } from '@redux/api/suggestion';
import useEffectOnce from '@hooks/useEffectOnce';
import PostForm from '@components/posts/post-form/PostForm';
import Posts from '@components/posts/Posts';
import { postService } from '@services/api/post/post.service';
import { orderBy, uniqBy } from 'lodash';
import { Utils } from '@services/utils/utils.service';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { getPosts } from '@redux/api/posts';
import { followerService } from '@services/api/followers/follower.service';
import { PostUtils } from '@services/utils/post-utils.service';

const Streams = () => {
  const allPosts = useSelector((state) => state.allPosts);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  let appPosts = useRef([]);
  const PAGE_SIZE = 8;

  const dispatch = useDispatch();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);

  function fetchPostData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalPostsCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllPosts();
    }
  }

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const getAllPosts = async () => {
    try {
      const response = await postService.getAllPosts(currentPage);
      if (response.data.posts.length > 0) {
        appPosts = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts, '_id');
        const orderedPosts = orderBy(allPosts, ['createdAt'], ['desc']);
        setPosts(orderedPosts);
      }
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffectOnce(() => {
    getUserFollowing();
    dispatch(getUserSuggestions());
    dispatch(getPosts());
  });

  useEffect(() => {
    setLoading(allPosts?.isLoading);
    const orderedPosts = orderBy(allPosts?.posts, ['createdAt'], ['desc']);
    setPosts(orderedPosts);
    setTotalPostsCount(allPosts?.totalPostsCount);
  }, [allPosts]);

  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
  }, [posts]);

  return (
    <div className="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef} style={{ backgroundColor: 'white' }}>
          <PostForm />
          <Posts allPosts={posts} postsLoading={loading} userFollowing={following} />
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
