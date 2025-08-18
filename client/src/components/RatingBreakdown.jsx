import React, { useEffect, useState } from "react";
import { Rate, Progress } from "antd";

const RatingBreakdown = ({ distribution }) => {
  const [totalRatings, setTotalRating] = useState(0);

  return (
    <div className="w-full max-w-[300px]">
      {distribution
        .sort((a, b) => b.star - a.star)
        .map((item) => (
          <div key={item.star} className="flex items-center mb-2">
            <Rate disabled defaultValue={item.star} className="flex-shrink-0" />
            <Progress
              percent={parseFloat(item.percent)}
              showInfo={false}
              strokeColor="#fadb14"
              className="flex-1 ml-2"
            />
            <span className="ml-2">{item.count}</span>
          </div>
        ))}
    </div>
  );
};

export default RatingBreakdown;
