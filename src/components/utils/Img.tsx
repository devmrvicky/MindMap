interface ImgProps {
  imgSrc: string;
  altText?: string;
  className?: string;
}

const Img = ({ imgSrc, altText = "", className = "" }: ImgProps) => {
  return (
    <div
      className={` flex justify-center items-center ${
        altText ? "bg-gray-200" : ""
      } ${className}`}
    >
      <img src={imgSrc} alt={altText} className="w-full h-full" />
    </div>
  );
};

export default Img;
