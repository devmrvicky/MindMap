import { useState } from "react";

type ImgWithSkeletonProps = {
  src: string;
  alt?: string;
  className?: string;
  skeletonClassName?: string;
};

const ImgWithSkeleton = ({
  src,
  alt = "",
  className = "",
  skeletonClassName = "bg-gray-200 animate-pulse",
}: ImgWithSkeletonProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      {!loaded && (
        <div
          className={`absolute inset-0 w-full h-full rounded ${skeletonClassName}`}
          data-testid="img-skeleton"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } w-full h-full object-cover rounded`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
};

export default ImgWithSkeleton;
