import React, { useState } from "react";
import { useInView } from "react-intersection-observer";

const LoadMoreTrigger = ({ hasNextPage, loadMore, isLoading }) => {
  const { ref, inView, entry } = useInView();
  const [oldY, setOldY] = useState(0);

  React.useEffect(() => {
    if (entry && inView && hasNextPage) {
      if (oldY !== entry.intersectionRect.y) {
        loadMore();
        setOldY(entry.intersectionRect.y);
      }
    }
  }, [inView, loadMore, hasNextPage, entry, oldY, isLoading]);

  return <div ref={ref}>⠀</div>;
};

export default LoadMoreTrigger;
