import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Sha256 from "crypto-js/sha256";

import { Api } from "../../core/api";
import { ValidateEmail } from "../../core/utilities";

import "../index.scss";

document.title = "Recover password";

const RecoverPassword = () => {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [disableButton, isDisableButton] = useState<boolean>(false);
    const [showResult, isShowResult] = useState<boolean>(false);

    const [token, setToken] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    useEffect(() => {
        const search = new URLSearchParams(window.location.search);
        const _token = search.get("token");
        if (!_token) return;

        setToken(_token);
    }, []);

    const clickRecoverPassword = () => {
        if (email == "") {
            setMessage("Email is required.");
            return;
        }
        if (!ValidateEmail(email)) {
            setMessage("Email is not valid");
            return;
        }
        setMessage("");
        isDisableButton(true);

        Api.Init("GET", `user/recoverPassword/${email}`, null, response => {
            isDisableButton(false);
            setMessage(response.result);

            if (response.status == 200) isShowResult(true);
        });
    };
    const clickUpdatePassword = () => {
        if (password == "" ||
            confirmPassword == "") {
            let message = "";

            if (password == "") message += "Password ";
            if (confirmPassword == "") message += ((password == "") ?
                " and confirm password " : "Confirm password ");

            setMessage(message + "is required");
            return;
        }
        if (password != confirmPassword) {
            setMessage("Password and confirm password are not the same");
            return;
        }
        if (password.length < 8) {
            setMessage("The password must be a minimum of 8 characters");
            return;
        }
        setMessage("");
        isDisableButton(true);

        const body = {
            token,
            password: Sha256(password).toString()
        };
        Api.Init("POST", "user/recoverPassword", body, response => {
            isDisableButton(false);
            setMessage(response.result);
            isShowResult(true);
        });
    }

    return <div className="app">
        <div className="appForm card">
            <header className="card-header">
                <h2 className="card-header-title">Recover password</h2>
            </header>
            <div className="card-content">
                <div className="content">
                    {(!showResult) && <>
                        {(token != "") && <>
                            <div className="field">
                                <label>New password:</label>
                                <div className="control">
                                    <input className="input" type="password"
                                        value={password}
                                        onChange={element => setPassword(element.target.value)} />
                                </div>
                            </div>
                            <div className="field">
                                <label>Confirm password:</label>
                                <div className="control">
                                    <input className="input" type="password"
                                        value={confirmPassword}
                                        onChange={element => setConfirmPassword(element.target.value)} />
                                </div>
                            </div>
                            {(message != "") && <div className="field">
                                <div className="control">
                                    <small>{message}</small>
                                </div>
                            </div>}
                            <div className="field">
                                <div className="control">
                                    <button className="button"
                                        disabled={disableButton}
                                        onClick={clickUpdatePassword}>Update</button>
                                </div>
                            </div>
                        </> || <>
                            <div className="field">
                                <label>Email:</label>
                                <div className="control">
                                    <input className="input" type="email"
                                        value={email}
                                        onChange={element => setEmail(element.target.value)} />
                                </div>
                            </div>
                            {(message != "") && <div className="field">
                                <div className="control">
                                    <small>{message}</small>
                                </div>
                            </div>}
                            <div className="field">
                                <div className="control">
                                    <button className="button"
                                        disabled={disableButton}
                                        onClick={clickRecoverPassword}>Recover password</button>
                                </div>
                            </div>
                        </>}
                    </> || <>
                        <div className="field">
                            <div className="control">
                                <small>{message}</small>
                            </div>
                        </div>
                    </>}
                </div>
            </div>
            <footer className="card-footer">
                <a className="card-footer-item" href="/index.html">Login</a>
            </footer>
        </div>
    </div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RecoverPassword />);