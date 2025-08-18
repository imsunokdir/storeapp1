import React, { useEffect } from "react";
import { Commet, Slab, ThreeDot } from "react-loading-indicators";

const LoadBalls = () => {
  useEffect(() => {
    // Prevent scroll while loading
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return (
    <div className=" min-h-screen flex items-center justify-center mt-[-100px]">
      <ThreeDot color="gray" size="medium" text="" textColor="" />
    </div>
  );
};

export default LoadBalls;
