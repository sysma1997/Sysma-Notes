import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { Api } from "../../core/api";

import "../index.scss";

const UpdateEmail = () => {
    const [message, setMessage] = useState<string>("Validating token...");

    useEffect(() => {
        const search = new URLSearchParams(window.location.search);
        const token = search.get("token");

        setTimeout(async () => {
            const response = await Api.Init("PUT", "user/update/email", {
                token: token
            });
            setMessage(response.result);
        }, 1500);
    }, []);

    return <div className="app">
        <div className="appForm card">
            <header className="card-header">
                <h3 className="card-header-title">Update email</h3>
            </header>
            <div className="card-content">
                <div className="content">
                    <label>{message}</label>
                </div>
            </div>
            <footer className="card-footer">
                <a className="card-footer-item" href="/index.html">Login</a>
            </footer>
        </div>
    </div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<UpdateEmail />);