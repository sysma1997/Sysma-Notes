import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Sha256 from "crypto-js/sha256";

import { Api } from "../core/api";

import "./index.scss";

document.title = "Sysma Notes: Login";

const App = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [disableButton, isDisableButton] = useState<boolean>(false);

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (!token) return;

        Api.Init("GET", "user/get", null, response => {
            if (response.status != 200) {
                window.localStorage.removeItem("token");
                return;
            }

            console.log(JSON.parse(response.result));
        });
    }, []);

    const clickLogin = () => {
        if (email == "" ||
            password == "") {
            let message = "";

            if (email == "") message += "Email ";
            if (password == "") message += (email == "") ? " and password " : "Password ";

            setMessage(message + "cannot be empty");
            return;
        }
        setMessage("");
        isDisableButton(true);

        const body = {
            email,
            password: Sha256(password).toString()
        };
        Api.Init("POST", "user/login", body, response => {
            isDisableButton(false);
            if (response.status != 200) {
                setMessage(response.result);
                return;
            }

            window.localStorage.setItem("token", response.result);
        });
    };

    return <div className="app">
        <div className="appForm card">
            <header className="card-header">
                <h3 className="card-header-title">Sysma Notes</h3>
            </header>
            <div className="card-content">
                <div className="content">
                    <div className="field">
                        <label className="label">Email:</label>
                        <div className="control">
                            <input className="input" type="text"
                                value={email}
                                onChange={element => setEmail(element.target.value)} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Password:</label>
                        <div className="control">
                            <input className="input" type="password"
                                value={password}
                                onChange={element => setPassword(element.target.value)} />
                        </div>
                    </div>
                    {(message != "") && <div className="field">
                        <small>{message}</small>
                    </div>}
                    <div className="field">
                        <div className="control">
                            <button className="button"
                                disabled={disableButton}
                                onClick={clickLogin}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <a className="card-footer-item" href="/register/index.html">Register</a>
                <a className="card-footer-item" href="/recoverPassword/index.html">I forgot my password</a>
            </div>
        </div>
    </div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);