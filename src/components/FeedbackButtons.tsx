export const FeedbackButtons = () => {
  return (
    <div className="mt-4">
      <p className="mb-2">Was this answer useful?</p>
      <div className="flex space-x-4">
        <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2">
          😊 Yes
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2">
          😐 Unsure
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2">
          😞 No
        </button>
      </div>
    </div>
  );
};
