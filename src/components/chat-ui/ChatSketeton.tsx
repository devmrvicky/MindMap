const ChatSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse justify-self-start">
      {/* User bubble */}
      <div className="flex justify-end">
        <div className="bg-[#131313] text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[75%] flex flex-col gap-2">
          <div className="h-3 w-[180px] bg-gray-500/40 rounded"></div>
        </div>
      </div>

      {/* Assistant bubble */}
      <div className="flex justify-start">
        <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[70%] flex flex-col gap-2">
          <div className="h-3 min-[520px]:w-[260px] bg-gray-400/40 dark:bg-gray-600/40 rounded"></div>
          <div className="h-3 min-[520px]:w-[200px] bg-gray-400/40 dark:bg-gray-600/40 rounded"></div>
          <div className="h-3 min-[520px]:w-[150px] bg-gray-400/40 dark:bg-gray-600/40 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
