import {Route, Routes} from "react-router";

import Page from './components/testPage/Main.tsx';
import BaseArea from "./components/Panel/Base.tsx";

function App() {
  return (
      <Routes>
          <Route path={"/"} element={<BaseArea />}/>
          <Route path={"/page"} element={<Page />} />
      </Routes>
  )
}

export default App
