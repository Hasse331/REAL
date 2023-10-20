import "../styles/globals.css";
import React, { useState, useRef, useEffect, useCallback } from "react";

function InfiniteScroll({ ComponentToRender }: any) {
  const [items, setItems] = useState([1, 2, 3]);
  const loader = useRef(null);

  const loadMore = useCallback(() => {
    // Generating a new array of 5 numbers based on the current length of the items array
    const newData = Array.from({ length: 2 }, (_, i) => i + items.length + 1);

    // Updating the state with the new items
    setItems((prevState) => [...prevState, ...newData]);
  }, [items.length]);

  useEffect(() => {
    const currentLoader = loader.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 1.0,
      }
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [items, loadMore]); // We'll rerun this effect if the items array changes.

  return (
    <div>
      {items.map((item) => (
        <ComponentToRender key={item} />
      ))}
      <div ref={loader}>Loading...</div>
    </div>
  );
}

export default InfiniteScroll;
