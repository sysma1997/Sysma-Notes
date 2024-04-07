import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Sha256 from "crypto-js/sha256"

import { Api } from "../../core/api"
import { ValidateEmail } from "../../core/utilities"

import "../index.scss";

document.title = "Register";

const Register = () => {
    const [token, setToken] = useState<string>("noToken");

    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [disableButton, isDisableButton] = useState<boolean>(false);

    const [sendEmail, isSendEmail] = useState<boolean>(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const _token = params.get("token");
        if (_token) setToken("validateToken");
        else return;

        setTimeout(async () => {
            const response = await Api.Init("POST", `user/register/token`, { token: _token });
            setToken("tokenResult")
            if (response.status != 201) {
                setMessage(message);
                return;
            }

            setMessage("User register success");
        }, 1500);
    }, []);

    const clickRegister = () => {
        if (name == "" ||
            phone == "" ||
            email == "" ||
            password == "" ||
            confirmPassword == "") {
            let message = "";
            let comma = 0;

            if (name == "") {
                message += "Full name";
                comma++;
            }
            if (phone == "") message += (comma++ > 0) ? ", phone" : "Phone";
            if (email == "") message += (comma++ > 0) ? ", email" : "Email";
            if (password == "") message += (comma++ > 0) ? ", password" : "Password";
            if (confirmPassword == "") message += (comma > 0) ? ", confirmPassword" : "ConfirmPassword";

            setMessage(message + ((comma > 1) ? " are required" : " is required"));
            return;
        }
        if (!ValidateEmail(email)) {
            setMessage("Email not valid");
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
            name, phone, email,
            password: Sha256(password).toString()
        };
        Api.Init("POST", "user/register", body, response => {
            isDisableButton(false);
            if (response.status != 200) {
                setMessage(response.result);
                return;
            }

            isSendEmail(true);
        });
    };

    return <div className="app">
        <div className="appForm card">
            <header className="card-header">
                <h3 className="card-header-title">Register</h3>
            </header>
            <div className="card-content">
                <div className="content">
                    {((token == "validateToken") && <>
                        Validating token...
                    </>) || 
                    ((token == "tokenResult") && <>
                        {message}
                    </>)}
                    {((token == "noToken" && !sendEmail) && <>
                        <div className="field">
                            <label>Full name:</label>
                            <div className="control">
                                <input className="input" type="text"
                                    value={name}
                                    onChange={element => setName(element.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label>Phone:</label>
                            <div className="control">
                                <input className="input" type="text"
                                    value={phone}
                                    onChange={element => setPhone(element.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label>Email:</label>
                            <div className="control">
                                <input className="input" type="email"
                                    value={email}
                                    onChange={element => setEmail(element.target.value)} />
                            </div>
                        </div>
                        <div className="field">
                            <label>Password:</label>
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
                            <small>{message}</small>
                        </div>}
                        <div className="field">
                            <div className="control">
                                <button className="button"
                                    disabled={disableButton}
                                    onClick={clickRegister}>Register</button>
                            </div>
                        </div>
                    </>) ||
                    ((token == "noToken") && <>
                        An email was send to {email} to confirm your registration.
                    </>)}
                </div>
            </div>
            <footer className="card-footer">
                <a className="card-footer-item" href="/index.html">Login</a>
            </footer>
        </div>
    </div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Register />);