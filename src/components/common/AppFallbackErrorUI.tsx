const AppFallbackErrorUI = () => (
  <div className="flex flex-col items-center justify-center h-screen p-8 text-red-700 bg-red-50 border border-red-300 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold mb-4">앗! 문제가 발생했어요!</h2>
    <p className="text-xl text-center mb-6">
      죄송합니다. 페이지를 표시하는 데 오류가 발생했습니다.
    </p>
    <button
      className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors shadow"
      onClick={() => window.location.reload()}
    >
      다시 시도하기
    </button>
    <p className="mt-4 text-gray-600 text-sm">
      문제가 지속되면 관리자에게 문의해주세요.
    </p>
  </div>
);

export default AppFallbackErrorUI;
