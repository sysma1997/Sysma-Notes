import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { Api } from "../../core/api"
import { User } from "../../core/models/user"

import { Navbar } from "./shared/navbar"

import "./index.scss";

document.title = "Dashboard";

const Dashboard = () => {
    const [user, setUser] = useState<User>();

    return <div className="app">
        <Navbar user={user} setUser={setUser} />
    </div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Dashboard />);