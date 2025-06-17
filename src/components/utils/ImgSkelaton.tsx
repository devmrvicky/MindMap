import React from "react";
import { cn } from "@/lib/utils";

interface ImgSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const ImgSkeleton: React.FC<ImgSkeletonProps> = ({
  width = 200,
  height = 200,
  className,
  ...props
}) => (
  <div
    className={cn("animate-pulse rounded-md bg-muted", className)}
    style={{ width, height }}
    {...props}
  />
);

export default ImgSkeleton;
