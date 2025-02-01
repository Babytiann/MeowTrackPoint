import { Button, Select, Modal } from "antd";
import Card from "./Card.tsx";
import { useState } from "react";

function TrackPoint({ events, setEvents, pointList, setPointList, nowEvent, setNowEvent }: Readonly<TrackPointProps>) {
    const [modal1Open, setModal1Open] = useState(false);

    const eventList = events.map(item => (
        <Card key={item} event={item} buttonClick={buttonClick} />
    ));

    function buttonClick(item: string) {
        setEvents(events.filter((event) => event !== item));
        if (!pointList.includes(item)) {
            setPointList([...pointList, item]);
        }
    }

    const handleClear = () => {
        setModal1Open(true);
    };

    const confirmClear = () => {
        setEvents([]);
        setPointList(prevPointList => [...prevPointList, ...events]);
        setModal1Open(false);
        localStorage.removeItem("events");
    };

    const closeModal = () => setModal1Open(false);

    const handleAddEvent = () => {
        if (nowEvent && !events.includes(nowEvent)) {
            setEvents(prevEvents => {
                const newEvents = [...prevEvents, nowEvent];
                localStorage.setItem("events", JSON.stringify(newEvents));
                return newEvents;
            });
            setPointList(pointList.filter(item => item !== nowEvent));
            setNowEvent(null);
        }
    };

    return (
        <div className="mt-5 p-2 rounded-2xl">
            <div className="flex flex-row relative">
                <Select
                    value={nowEvent}
                    onChange={(value) => {
                        setNowEvent(value);
                    }}
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Search to Select"
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={pointList.map(item => ({ label: item, value: item }))}
                />
                <div className="ml-5">
                    <Button color="primary" variant="outlined" onClick={handleAddEvent}>
                        添加
                    </Button>
                </div>
                <div className="absolute right-10">
                    <Button color="danger" variant="outlined" onClick={handleClear}>
                        清空
                    </Button>
                </div>
                <Modal
                    open={modal1Open}
                    onClose={closeModal}
                    title="确认清空吗?"
                    onOk={confirmClear}
                    onCancel={closeModal}
                >
                    <p>清空后所有已选的事件将丢失，是否继续？</p>
                </Modal>
            </div>

            <hr className="mt-4 border-gray-400" />

            <div className="pt-4 px-9 rounded-xl flex justify-between">
                <div>事件名称</div>
            </div>

            <div>{eventList}</div>
        </div>
    );
}

export default TrackPoint;
