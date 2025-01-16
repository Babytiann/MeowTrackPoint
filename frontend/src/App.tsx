import './App.css'
import {Route, Routes} from "react-router";

import Page from './components/testPage/Main.tsx';

function App() {
  return (
      <Routes>
        <Route path={"/page"} element={<Page />} />
      </Routes>
  )
}

export default App
