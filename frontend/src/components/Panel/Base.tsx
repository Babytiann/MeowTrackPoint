import {useState} from "react";
import {Outlet} from "react-router";
import Sider from "./components/Sider";
import Header from "./components/Header";


const BaseArea = () =>{
    const [brightMode, setBrightMode] = useState(true);

    // 切换 brightMode 的函数
    const toggleMode = () => {
        setBrightMode(prevMode => !prevMode);  // 切换模式
    };

    return (
        <div className="flex">
            <Sider brightMode={brightMode} ></Sider>
            <div className="flex flex-col">
                <Header></Header>
                <Outlet/>
            </div>

        </div>
    );
};

export default BaseArea;