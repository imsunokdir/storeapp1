import React from "react";
import { motion } from "framer-motion";
import StoreCardSkeleton from "./skeletons/StoreCardSkeleton";

const RenderSkeletonCards = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StoreCardSkeleton />
        </motion.div>
      ))}
    </>
  );
};

export default RenderSkeletonCards;
