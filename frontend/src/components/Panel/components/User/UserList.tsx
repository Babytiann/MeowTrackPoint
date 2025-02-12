import fetchData from "../../../../services/fetchData.ts";
import { useEffect, useState, useRef } from "react";
import Card from "./Card.tsx"
import * as React from "react";
import { Select, Button } from "antd";

function UserList() {
    const [userData, setUserData] = useState<UserData[] | null>(null);
    const [userCards, setUserCards] = useState<React.ReactNode[]>();
    const [nowId, setNowId] = useState<string | null>(null);
    const [nowBrowser, setNowBrowser] = useState<string | null>(null);
    const user = useRef<UserData[]>([]);
    const idList = useRef<string[]>([]);
    const browserList = useRef<string[]>([]);

    useEffect(() => {
        fetchData().then((res) => {
            if (userData === null) {
                setUserData(res.baseInfoData);
            }
        });
    }, [userData]);

    useEffect(() => {
        if (userData !== null) {
            user.current = Array.from(
                new Set(
                    userData.map((item) => {
                        return JSON.stringify({
                            uuid: item.uuid ? item.uuid : "null",
                            browser: item.browser,
                            os: item.os,
                        });
                    })
                )
            )
                .map((item) => JSON.parse(item))
                .sort((a, b) => {
                    if (!a.uuid || !b.uuid) return 0;
                    return a.uuid.localeCompare(b.uuid);
                });
        }

        user.current.forEach((item) => {
            if (!idList.current.includes(item.uuid)) {
                idList.current.push(item.uuid);
            }
            if (!browserList.current.includes(item.browser)) {
                browserList.current.push(item.browser);
            }
        });

        // 更新 userCards，当 nowId 为 null 时展示所有数据，否则只展示当前选中的 ID
        setUserCards(user.current.map((item) => {
            if ((nowId === null || item.uuid === nowId) && (nowBrowser === null || item.browser === nowBrowser)) {
                return (
                    <Card
                        key={item.uuid}
                        item={item}
                    />
                );
            }
        }));

    }, [userData, nowId, nowBrowser]);

    const handleReset = () => {
        setNowId(null); // 清空筛选条件
    };

    const handleBrowserReset = () => {
        setNowBrowser(null); // 清空筛选条件
    }

    return (
        <div>
            <div>
                <div className="first:mt-5 flex justify-between rounded-xl border-e-gray-200">
                    <div className="md:w-[400px] w-[200px] flex items-center gap-2">
                        <span>用户ID :</span>
                        <Select
                            value={nowId}
                            onChange={(value) => {
                                setNowId(value);
                            }}
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Search to Select"
                            optionFilterProp="label"
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={idList.current.map(item => ({ label: item, value: item }))}
                        />
                        <Button color="danger" variant="outlined" onClick={handleReset}>清空</Button>
                    </div>

                    <div className="w-[400px] flex items-center justify-center gap-2">
                        <span>浏览器 :</span>
                        <Select
                            value={nowBrowser}
                            onChange={(value) => {
                                setNowBrowser(value);
                            }}
                            showSearch
                            style={{ width: 100 }}
                            placeholder="Search to Select"
                            optionFilterProp="label"
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={browserList.current.map(item => ({ label: item, value: item }))}
                        />
                        <Button color="danger" variant="outlined" onClick={handleBrowserReset}>清空</Button>
                    </div>
                    <div className="w-[100px] md:mr-20 mr-5">
                        操作系统 :
                    </div>
                </div>
            </div>
            <hr className="mt-4 border-gray-400" />
            <div className="mt-4">
                {userCards}
            </div>
        </div>
    );
}

export default UserList;
