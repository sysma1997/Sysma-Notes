import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom/client"

import "./index.scss"

document.title = "Sysma Notes: Login"

const App = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const clickLogin = () => {
        if (email == "" ||
            password == "") {
            let message = "";

            if (email == "") message += "Email ";
            if (password == "") message += (email == "") ? " and password " : "Password ";

            setMessage(message + "cannot be empty");
        }
        setMessage("");


    };

    return <div className="app">
        <div className="login card">
            <header className="card-header">
                <h3 className="card-header-title">Sysma Notes</h3>
            </header>
            <div className="card-content">
                <div className="content">
                    <div className="field">
                        <label className="label">Email:</label>
                        <div className="control">
                            <input className="input" type="text"
                                value={ email }
                                onChange={ element => setEmail(element.target.value) } />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Password:</label>
                        <div className="control">
                            <input className="input" type="password"
                                value={password}
                                onChange={ element => setPassword(element.target.value) } />
                        </div>
                    </div>
                    {(message != "") && <div className="field">
                        <small>{message}</small>
                    </div>}
                    <div className="field">
                        <div className="control">
                            <button className="button" onClick={ clickLogin }>Login</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <a className="card-footer-item" href="#">Register</a>
                <a className="card-footer-item" href="#">I forgot my password</a>
            </div>
        </div>
    </div>
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)