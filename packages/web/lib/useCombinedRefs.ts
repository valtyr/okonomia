import React from 'react';

function useCombinedRefs<T>(
  ...refs: (React.MutableRefObject<T> | React.ForwardedRef<T>)[]
) {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}

export default useCombinedRefs;
