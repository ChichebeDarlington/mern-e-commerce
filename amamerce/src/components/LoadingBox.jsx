import React from "react";
import Spinner from "react-bootstrap/Spinner";

const LoadingBox = () => {
  return (
    <div>
      <Spinner className="border" role="status">
        <span className="visually-hidden">Loading</span>
      </Spinner>
    </div>
  );
};

export default LoadingBox;
