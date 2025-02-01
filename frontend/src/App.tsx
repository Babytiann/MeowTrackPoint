import { Route, Routes } from "react-router";
import {Suspense, lazy, useState, useEffect} from "react";
import Loading from "./components/Panel/Loading";

// 使用 React.lazy 动态加载组件
const Page = lazy(() => import('./components/testPage/Main.tsx'));
const Base = lazy(() => import("./components/Panel/Base.tsx"));
const Home = lazy(() => import("./components/Panel/components/Home.tsx"));
const UserList = lazy(() => import("./components/Panel/components/UserList.tsx"));
const TrackPoint = lazy(() => import("./components/Panel/components/trackpoint/TrackPoint.tsx"));

function App() {

    const [events, setEvents] = useState<string[]>([]);
    const [nowEvent, setNowEvent] = useState<string | null>(null);
    const [pointList, setPointList] = useState<string[]>([ "click", "testEvent", "sdkTest"]);

    useEffect(() => {
        const events = localStorage.getItem("events");
        if (events) {
            setEvents(JSON.parse(events));
        }
    }, [])

    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path={"/"} element={<Base />}>
                    <Route index element={<Home events={events} />} />
                    <Route path={"/userlist"} element={<UserList />} />
                    <Route path={"/error"} element={<Loading />} /> {/* 暂且这么写 */}
                    <Route path={"/track"} element={<TrackPoint events={events} nowEvent={nowEvent} setNowEvent={setNowEvent} setEvents={setEvents} pointList={pointList} setPointList={setPointList}/>} />
                </Route>
                <Route path={"/page"} element={<Page />} />
            </Routes>
        </Suspense>
    );
}

export default App;
