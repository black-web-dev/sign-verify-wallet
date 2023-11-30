import React, { useEffect, useRef, useState } from "react";
import * as jdenticon from "jdenticon";

const Avatar: React.FC<{
  address: string;
}> = ({ address }) => {
  const icon = useRef<any>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (icon.current !== null) {
      jdenticon.update(icon.current, address);
    }
  }, [address, error]);

  useEffect(() => {
    setError(false);
  }, [address]);

  const handleError = () => {
    setError(true);
  };

  return (
    <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center">
      <svg
        data-jdenticon-value={address}
        height="100%"
        ref={icon}
        width="100%"
      />
    </div>
  );
};

export default Avatar;
