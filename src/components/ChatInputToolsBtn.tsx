import ImgCreationToogleBtn from "./buttons/ImgCreationToggleBtn";
import FileUploadBtn from "./buttons/FileUploadBtn";

const ChatInputToolsBtn = ({
  setWantToImgUpload,
}: {
  setWantToImgUpload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex flex-col items-center w-full gap-2">
      <FileUploadBtn setWantToImgUpload={setWantToImgUpload} />
      {/* image creation button */}
      <ImgCreationToogleBtn />
    </div>
  );
};

export default ChatInputToolsBtn;
