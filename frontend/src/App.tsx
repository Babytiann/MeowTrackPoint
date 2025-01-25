import {Route, Routes} from "react-router";

import Page from './components/testPage/Main.tsx';
import Base from "./components/Panel/Base.tsx";
import Home from "./components/Panel/components/Home.tsx";

function App() {
  return (
      <Routes>
          <Route path={"/"} element={<Base />}>
              <Route index element={<Home />}></Route>
              <Route path={"/userlist"} element={<Home />}></Route>  {/*暂且这么写*/}
              <Route path={"/error"} element={<Home />}></Route>  {/*暂且这么写*/}
          </Route>
          <Route path={"/page"} element={<Page />} />
      </Routes>
  )
}

export default App
