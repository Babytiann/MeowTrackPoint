import fetchData from "../../../../services/fetchData.ts";
import { useEffect, useState, useRef } from "react";
import Card from "./Card.tsx";
import { Select } from "antd";
import * as React from "react";

function ErrorList() {
    const [ErrorData, setErrorData] = useState<ErrorData[] | null>(null);
    const [errorCards, setErrorCards] = useState<React.ReactNode[]>([]);
    const [ErrorType, setErrorType] = useState<string>("total");

    const optionList = useRef<{ label: string; value: string }[]>([]);
    const user = useRef<ErrorData[]>([]);
    const key = useRef(0);

    useEffect(() => {
        fetchData().then((res) => {
            if (ErrorData === null) {
                setErrorData(res.errorData);
            }
        });
    }, [ErrorData]);

    // 格式化 create_at 字段
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以要加1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}`;
    };

    useEffect(() => {
        if (ErrorData !== null) {
            // 去重、排序和格式化
            user.current = Array.from(
                new Set(
                    ErrorData.map((item: ErrorData) => {
                        return JSON.stringify({
                            uuid: item.uuid ? item.uuid : "null",
                            message: item.message,
                            stack: item.stack,
                            type: item.type,
                            page_url: item.page_url,
                            create_at: item.create_at,
                        });
                    })
                )
            )
                .map((item) => JSON.parse(item)) // 将字符串解析回对象
                .sort((a, b) => {
                    if (!a.uuid || !b.uuid) return 0; // 如果 uuid 无效，保持原顺序
                    return a.uuid.localeCompare(b.uuid); // 根据 uuid 进行排序
                })
                .map((item) => {
                    item.create_at = formatDate(item.create_at);
                    return item;
                });

            // 更新下拉框选项
            optionList.current = Array.from(
                new Set(
                    ErrorData?.map(item => item.type)
                )
            ).map(event => ({
                label: event,
                value: event
            }));

            optionList.current.push({ label: 'total', value: 'total' });
        }
    }, [ErrorData]);

    useEffect(() => {
        if (ErrorData !== null) {
            // 根据选择的 ErrorType 过滤数据
            let filteredData = user.current;
            if (ErrorType && ErrorType !== "total") {
                filteredData = user.current.filter(item => item.type === ErrorType);
            }

            // 确保筛选后不会有重复项
            const uniqueFilteredData = Array.from(
                new Set(filteredData.map((item) => JSON.stringify(item)))
            ).map((item) => JSON.parse(item));

            // 每次筛选时，清空旧的数据并重新设置
            setErrorCards(uniqueFilteredData.map((item) => {
                return (
                    <Card
                        key={item.uuid || key.current++}  // 使用 uuid 或递增的 key
                        item={item}
                    />
                );
            }));
        }
    }, [ErrorType, ErrorData]);

    return (
        <div>
            <div>
                <div className="first:mt-5 flex justify-between rounded-xl border-e-gray-200">
                    <div className="md:w-[400px] w-[200px]">
                        用户ID :
                    </div>
                    <div className="w-[100px]">
                        错误信息 :
                    </div>
                    <div className="w-[90px]">
                        堆栈信息 :
                    </div>
                    <div className="w-[200px] flex justify-around ">
                        <div>错误类型 :</div>
                        <Select
                            style={{ width: 100 }}
                            value={ErrorType}
                            onChange={(e: string) => setErrorType(e)}  // 确保 onChange 接受的是 string 类型
                            options={optionList.current}
                        />
                    </div>
                    <div className="w-[100px] mr-5">
                        页面URL :
                    </div>
                    <div className="w-[100px] md:mr-10 mr-5">
                        创建时间 :
                    </div>
                </div>
                <hr className="mt-4 border-gray-400" />
                <div className="mt-4">
                    {errorCards}
                </div>
            </div>
        </div>
    );
}

export default ErrorList;
