import { useState } from "react";

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export function SkeletonImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  ...props
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Shimmer Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-surface via-canvas/40 to-surface" />
      )}

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
