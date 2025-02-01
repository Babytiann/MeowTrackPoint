import {Button, Select} from "antd";
import { useState } from "react";
import Card from "./Card.tsx";

function TrackPoint() {
    const defaultValue = ["puv"];

    const [events, setEvents] = useState<string[]>(defaultValue);
    const [nowEvents, setNowEvents] = useState<string | null>(null);
    const [optionList, setOptionList] = useState<string[]>([ "click", "order", "pay"]);

    const eventList = events.map(item => (
        <Card key={item} event={item} buttonClick={buttonClick}/>
    ));

    function buttonClick(item: string) {
        setEvents(events.filter((event) => event !== item));
        if (!optionList.includes(item)){
            setOptionList([...optionList, item]);
        }
    }

    return (
        <div className="mt-5 p-2 rounded-2xl ">
            <div className="flex flex-row">
                <Select
                    value={nowEvents}
                    onChange={(value) => {
                        setNowEvents(value);
                    }}
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Search to Select"
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={optionList.map(item => ({ label: item, value: item }))}
                 />
                <div className="ml-5">
                    <Button color="primary" variant="outlined" onClick={() => {
                        if (nowEvents && !events.includes(nowEvents)) {
                            setEvents(prevEvents => [...prevEvents, nowEvents]);
                            setOptionList(optionList.filter(item => item !== nowEvents));
                            setNowEvents(null)
                        }
                    }}>添加</Button>
                </div>
            </div>

            <hr className="mt-4 border-gray-400"/>

            <div className="pt-4 px-9
                        rounded-xl

                        flex
                        justify-between">
                <div>事件名称</div>
            </div>

            <div>{eventList}</div>
        </div>
    );
}

export default TrackPoint;
