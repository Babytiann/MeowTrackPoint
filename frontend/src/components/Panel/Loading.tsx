import '../../style/loading.css'

function Loading() {
    return (
        <div className="relative flex justify-center mt-80">
            <div className="sk-chase absolute left-0 bottom-[50%] -translate-x-1/2 translate-y-1/2">
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
            </div>
        </div>
    )
}

export default Loading
