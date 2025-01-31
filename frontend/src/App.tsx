import { Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import Loading from "./components/Panel/Loading";

// 使用 React.lazy 动态加载组件
const Page = lazy(() => import('./components/testPage/Main.tsx'));
const Base = lazy(() => import("./components/Panel/Base.tsx"));
const Home = lazy(() => import("./components/Panel/components/Home.tsx"));
const UserList = lazy(() => import("./components/Panel/components/UserList.tsx"));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path={"/"} element={<Base />}>
                    <Route index element={<Home />} />
                    <Route path={"/userlist"} element={<UserList />} />
                    <Route path={"/error"} element={<Loading />} /> {/* 暂且这么写 */}
                </Route>
                <Route path={"/page"} element={<Page />} />
            </Routes>
        </Suspense>
    );
}

export default App;
