import "../styles/EnvironmentVars.css";
import "../styles/GenericStyles.css";
import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import NavigationBar from "./MainPage/NavigationBar";
import Channels from "./MainPage/Channels";
import Streams from "./MainPage/Content/Streams";
import NewStream from "./MainPage/Content/NewStream";
import StreamDelete from "./MainPage/Content/StreamDelete";
import StreamEdit from "./MainPage/Content/StreamEdit";
import JoinMsg from "./MainPage/JoinMsg";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <NavigationBar />
        <div className="channels-and-content">
          <Channels />
          <div>
            <Route path="/" exact component={Streams} />
            <Route path="/streams/new" exact component={NewStream} />
            <Route path="/streams/edit" exact component={StreamEdit} />
            <Route path="/streams/delete" exact component={StreamDelete} />
          </div>
        </div>
        <JoinMsg />
      </BrowserRouter>
    </div>
  );
};

export default App;
