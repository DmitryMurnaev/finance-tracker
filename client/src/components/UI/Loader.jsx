const Loader = ({ fullScreen = false, text = 'Загрузка...' }) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            {text && <p className="text-gray-600 text-lg">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
};

export default Loader;