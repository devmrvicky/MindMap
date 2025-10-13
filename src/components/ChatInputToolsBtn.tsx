import ImgCreationToogleBtn from "./buttons/ImgCreationToggleBtn";
import FileUploadBtn from "./buttons/FileUploadBtn";

const ChatInputToolsBtn = ({
  setWantToImgUpload,
}: {
  setWantToImgUpload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center justify-center gap-1">
      <FileUploadBtn setWantToImgUpload={setWantToImgUpload} />
      {/* image creation button */}
      <ImgCreationToogleBtn />
    </div>
  );
};

export default ChatInputToolsBtn;
