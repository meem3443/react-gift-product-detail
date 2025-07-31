const AppLoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen text-gray-700 text-lg">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    <p className="ml-4">페이지를 불러오는 중입니다...</p>
  </div>
);

export default AppLoadingSpinner;
