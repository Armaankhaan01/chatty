import SuggestionsSkeletons from '@components/suggestions/SuggestionSkeleton';
import '@pages/social/streams/Stream.scss';

const StreamsSkeleton = () => {
  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post">
          <div>Post Form</div>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>Post Items</div>
          ))}
        </div>
        <div className="streams-suggestions">
          <SuggestionsSkeletons />
        </div>
      </div>
    </div>
  );
};

export default StreamsSkeleton;
