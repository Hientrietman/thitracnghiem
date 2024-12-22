import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./App.css";
import Approutes from "./Approutes.jsx";
import {Provider} from "react-redux";
import store from "./store/store";

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <BrowserRouter>
                    <Approutes/>
                </BrowserRouter>
            </Provider>
        </div>
    );
}

export default App;
