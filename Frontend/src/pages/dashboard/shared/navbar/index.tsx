import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

import { Api } from "../../../../core/api"
import { User } from "../../../../core/models/user"

import "./index.scss";

export const Navbar = (props: {
    user: User, 
    setUser: Dispatch<SetStateAction<User>>
}) => {
    const { user, setUser } = props;

    useEffect(() => {
        Api.Init("GET", "user/get", null, response => {
            if (response.status != 200) {
                if (response.status == 401) {
                    window.localStorage.removeItem("token");
                    window.location.href = "/index.html";
                }
                return;
            }

            const jUser = JSON.parse(response.result);
            const user = new User(jUser.id, jUser.name, jUser.phone, jUser.email);
            setUser(user);
        });
    }, []);

    const clickLogout = () => {
        window.localStorage.removeItem("token");
        window.location.href = "/index.html";
    };

    return <nav className="navbar is-light" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <a className="navbar-item" href="/dashboard/index.html">
                <b>SYSMA NOTES</b>
            </a>
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false"
                data-target="navbarMain">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarMain" className="navbar-menu">
            <div className="navbar-start">
                <a className="navbar-item" href="/dashboard/index.html">
                    Home
                </a>
            </div>
            <div className="navbar-end">
                <a className="navbar-item" href={ (user) ? "/dashboard/profile/index.html" : "#" }>
                    {(user) ? user.name : "load..."}
                </a>
                <a className="navbar-item" onClick={clickLogout}>Logout</a>
            </div>
        </div>
    </nav>
};