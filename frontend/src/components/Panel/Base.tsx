import { useState, useEffect } from "react";
import {Outlet} from "react-router";
import Sider from "./components/Sider";
import Header from "./components/Header";
import theme from "../../EchartThemeLight.json"
import * as echarts from "echarts";


const BaseArea = () =>{
    const [brightMode, setBrightMode] = useState(true);  // 亮暗模式

    useEffect(() => {
        const savedMode = localStorage.getItem("Mode");
        if (savedMode === "dark") {
            setBrightMode(false);
        }
    }, []);  // 空数组意味着只在组件挂载时执行一次

    // 切换 brightMode 的函数
    const toggleMode = () => {
        setBrightMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem("Mode", newMode ? "light" : "dark");
            return newMode;
        });
    };


    echarts.registerTheme('chalk', theme);

    return (
        <div className={`${brightMode ? ' ' : 'dark'}`}>
          <div className="flex  dark:bg-darkBg dark:text-white">
             <Sider brightMode={brightMode} ></Sider>
             <div className="grow flex flex-col">
                 <Header toggleMode={toggleMode} brightMode={brightMode}></Header>
                 <Outlet />
             </div>
          </div>
        </div>
    );
};

export default BaseArea;