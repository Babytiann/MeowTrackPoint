import fetchData from "../../../../services/fetchData.ts";
import { useEffect, useState, useRef } from "react";
import Card from "./Card.tsx"
import * as React from "react";

function UserList() {
    const [userData, setUserData] = useState<UserData[] | null>(null);
    const [userCards, setUserCards] = useState<React.ReactNode[]>();
    const user = useRef<UserData[]>([]);

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
                        // 返回一个唯一的字符串表示，每个对象
                        return JSON.stringify({
                            uuid: item.uuid? item.uuid : "null",
                            browser: item.browser,
                            os: item.os,
                        });
                    })
                )
            )
                .map((item) => JSON.parse(item)) // 将字符串解析回对象
                .sort((a, b) => {
                    if (!a.uuid || !b.uuid) return 0; // 如果 uuid 无效，保持原顺序
                    return a.uuid.localeCompare(b.uuid); // 根据 uuid 进行排序
                });
        }
        console.log(user.current);

        setUserCards(user.current.map((item) => {
            return (
                <Card
                    key={item.uuid}
                    item={item}
                />
            );
        }));

    }, [userData]);

    return (
        <div>
            {userCards}
        </div>
    );
}

export default UserList;