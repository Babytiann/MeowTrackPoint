const ErrorComponent = ({errorInfo}: Readonly<ErrorInfo>) => {
    return (
        <div className="w-auto h-auto bg-[#FFF2F0] text-center rounded-xl" >
            <h2>Error Occurred😭</h2>
            <p>ErrorInfo: {errorInfo}</p>
        </div>
    );
};

export default ErrorComponent;
