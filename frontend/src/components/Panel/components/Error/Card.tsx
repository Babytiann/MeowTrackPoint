import { useState } from "react";
import { Button } from "antd";

function Card({ item }: Readonly<{ item: ErrorData }>) {

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(prevState => !prevState);
    };
    return (
        <div className="mb-5 p-5 first:mt-5
                        flex justify-between

                        bg-cardBg
                        dark:bg-cardDarkBg
                        drop-shadow-md

                        rounded-xl
                        border-e-gray-200

                        whitespace-nowrap
                        overflow-elipsis">
            <div className="md:w-[200px] w-[100px] truncate">
                {item.uuid}
            </div>
            <div className="w-[100px] truncate">
                {item.message}
            </div>
            <div className="w-[100px] truncate">
                {item.stack}
            </div>
            <div className="w-[100px] truncate">
                {item.type}
            </div>
            <div className="w-[120px] truncate">
                {item.page_url}
            </div>
            <div className={`w-[100px] md:mr-10 mr-5 ${isExpanded ? 'hidden' : ''}`}>
                {item.create_at}
            </div>
            {/* 展开后显示完整信息 */}
            {isExpanded && (
                <div className="mt-3 text-sm text-gray-500 w-[200px] whitespace-normal">
                    <p><strong>详细堆栈信息:</strong> {item.stack}</p>
                    <p><strong>错误类型:</strong> {item.type}</p>
                    <p><strong>页面URL:</strong> {item.page_url}</p>
                    <p><strong>创建时间:</strong> {item.create_at}</p>
                </div>
            )}
            <div>
                <Button onClick={toggleExpand}>{isExpanded ? "收起" : "展开"}</Button>
            </div>
        </div>
    );
}

export default Card;