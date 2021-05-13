import React from "react";
import BussReg from "../bussReg/BussReg";

const Home = () => (
  <div>
    <div className="jumbotron">
      <h2>Home</h2>
      <p className="lead">Welcome to C-Track</p>
    </div>
    <div className="container">
      <BussReg />
    </div>
  </div>
);

export default Home;