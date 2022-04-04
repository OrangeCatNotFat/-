import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "./components/login";
import Frame from "./components/frame";
import {Findpwd} from "./components/findpwd";
import PrivateRoute from "./routes/privateRoute";
import {Administrator} from "./components/administrator";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route path={"/findPwd"} component={Findpwd}></Route>
                    <Route path={"/home"} component={Frame}></Route>
                    <Route exact path={"/"} component={Login}></Route>
                    {/*<PrivateRoute path={"/home"} component={Frame}></PrivateRoute>*/}
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
