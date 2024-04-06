import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import { Api } from "../../../core/api";
import { User } from "../../../core/models/user";

import { Navbar } from "../shared/navbar";

import "./index.scss";

document.title = "Profile...";

enum ProfileState { SHOW, EDIT_BASIC, EDIT_PASSWORD, EDIT_EMAIL };

const Profile = () => {
    const [user, setUser] = useState<User>();
    const [state, setState] = useState<ProfileState>(ProfileState.SHOW);

    useEffect(() => {
        if (!user) return;
        document.title = user.name;
    }, [user]);

    return <div className="app">
        <Navbar setUser={setUser} />
        {(user) && <div className="profile">
            <div className="pForm card">
                <header className="card-header">
                    <h3 className="card-header-title">My profile</h3>
                </header>
                <div className="card-content">
                    <div className="content">
                        {(state == ProfileState.SHOW) && <>
                            <div className="pfShow">
                                <label>Name:</label>
                                <label><b>{user.name}</b></label>
                            </div>
                            <div className="pfShow">
                                <label>Phone:</label>
                                <label><b>{user.phone}</b></label>
                            </div>
                            <div className="pfShow">
                                <label>Email:</label>
                                <label><b>{user.email}</b></label>
                            </div>
                        </>}
                    </div>
                </div>
                <footer className="card-footer">
                    <a className="card-footer-item" href="#">Update</a>
                    <a className="card-footer-item" href="#">Update password</a>
                    <a className="card-footer-item" href="#">Update email</a>
                </footer>
            </div>
        </div>}
    </div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Profile />);