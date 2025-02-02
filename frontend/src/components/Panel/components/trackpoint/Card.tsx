import { Button, Modal } from "antd";
import { useState } from "react";

function Card({ event, buttonClick }: Readonly<CardProps>) {
    const [modal1Open, setModal1Open] = useState(false);

    const handleDeleteClick = () => {
        // 打开确认框
        setModal1Open(true);
    };

    const confirmClear = () => {
        // 确认删除后执行 buttonClick 删除事件
        buttonClick(event);
        setModal1Open(false); // 关闭确认框

        // 更新 events 数据
        const List = localStorage.getItem("events");
        const updatedList = List ? JSON.parse(List) : [];
        const nowEvents = updatedList.filter((item: string) => item !== event);

        // 将更新后的列表存储到 localStorage
        localStorage.setItem("events", JSON.stringify(nowEvents));
    };

    return (
        <div className="mt-4 py-4 px-10
                        rounded-xl
                        border-e-gray-200
                        bg-cardBg
                        drop-shadow-md
                        flex
                        justify-between
                        ">
            <div>
                {event}
            </div>
            <div className="flex gap-4 justify-center items-center">
                <Button color="danger" variant="outlined" onClick={handleDeleteClick}>删除</Button>
                <Modal
                    open={modal1Open}
                    onClose={() => setModal1Open(false)}
                    title="确认删除吗?"
                    onOk={confirmClear} // 确认删除
                    onCancel={() => setModal1Open(false)} // 取消删除
                >
                    <p>删除后该事件将无法恢复，是否继续？</p>
                </Modal>
            </div>
        </div>
    );
}

export default Card;
