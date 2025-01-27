import {useState} from "react";
import {Outlet} from "react-router";
import Sider from "./components/Sider";
import Header from "./components/Header";
import theme from "../../EchartTheme.json"
import * as echarts from "echarts";


const BaseArea = () =>{
    const [brightMode, setBrightMode] = useState(true);  // 亮暗模式

    // 切换 brightMode 的函数
    const toggleMode = () => {
        setBrightMode(prevMode => !prevMode);  // 切换模式
    };

    echarts.registerTheme('chalk', theme);

    return (
        <div className={`${brightMode ? ' ' : 'dark'}`}>
          <div className="flex  dark:bg-darkBg dark:text-white">
             <Sider brightMode={brightMode} ></Sider>
             <div className="grow flex flex-col">
                 <Header></Header>
                 <Outlet />
             </div>
          </div>
        </div>
    );
};

export default BaseArea;