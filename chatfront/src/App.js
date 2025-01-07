import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import LoginProvider from "./state/LoginProvider";
import LoginPage from "./page/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <LoginProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/LoginPage" element={<LoginPage />} />
        </Routes>
      </LoginProvider>
    </BrowserRouter>
  );
}

export default App;
