import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Sha256 from "crypto-js/sha256";

import { Api } from "../../../core/api";
import { ValidateEmail } from "../../../core/utilities";
import { User } from "../../../core/models/user";

import { Navbar } from "../shared/navbar";

import "./index.scss";

document.title = "Profile...";

enum ProfileState { SHOW, EDIT_BASIC, EDIT_PASSWORD, EDIT_EMAIL };

const Profile = () => {
    const [user, setUser] = useState<User>();
    const [state, setState] = useState<ProfileState>(ProfileState.SHOW);
    const [message, setMessage] = useState<string>("");

    const [ubName, setUBName] = useState<string>("");
    const [ubPhone, setUBPhone] = useState<string>("");

    const [upPassword, setUPPassword] = useState<string>("");
    const [upNewPassword, setUPNewPassword] = useState<string>("");
    const [upConfirmPassword, setUPConfirmPassword] = useState<string>("");

    const [umEmail, setUMEmail] = useState<string>("");

    useEffect(() => {
        if (!user) return;
        document.title = user.name;
    }, [user]);
    useEffect(() => {
        if (state == ProfileState.EDIT_BASIC) {
            setUBName(user.name);
            setUBPhone(user.phone);
        }
    }, [state]);

    const clickUpdateType = (state: ProfileState) => {
        setState(state);
        setMessage("");
    };
    const clickUpdateBasic = () => {
        if (ubName == "" ||
            ubPhone == "") {
            let message = "";

            if (ubName == "") message += "Name";
            if (ubPhone == "") message += (ubName == "") ? ", phone " : "Phone ";

            setMessage(message + "cannot be empty");
            return;
        }
        setMessage("");

        Api.Init("PUT", "user/update", {
            name: ubName,
            phone: ubPhone
        }, response => {
            if (response.status != 200) {
                setMessage(response.result);
                return;
            }

            setMessage("Update user success.");
            setUser(user.setName(ubName).setPhone(ubPhone));
            setState(ProfileState.SHOW);
        });
    };
    const clickUpdatePassword = () => {
        if (upPassword == "" ||
            upNewPassword == "" ||
            upConfirmPassword == "") {
            let message = "";
            let comma = 0;

            if (upPassword == "") {
                message += "Password";
                comma++;
            }
            if (upNewPassword == "") message += (comma++ > 0) ? ", new password" : "New password";
            if (upConfirmPassword == "") message += (comma > 0) ? ", confirm password " : "Confirm password ";

            setMessage(message + "cannot be empty");
            return;
        }
        if (upNewPassword != upConfirmPassword) {
            setMessage("New password and confirm password are not the same");
            return;
        }
        setMessage("");

        Api.Init("PUT", "user/update/password", {
            oldPassword: Sha256(upPassword).toString(),
            newPassword: Sha256(upNewPassword).toString()
        }, response => {
            if (response.status != 200) {
                setMessage(response.result);
                return;
            }

            setMessage("Update password success");
            setUPPassword("");
            setUPNewPassword("");
            setUPConfirmPassword("");
            setState(ProfileState.SHOW);
        });
    };
    const clickUpdateEmail = () => {
        if (umEmail == "") {
            setMessage("Email cannot be empty");
            return;
        }
        if (!ValidateEmail(umEmail)) {
            setMessage("Email not valid");
            return;
        }
        setMessage("");

        Api.Init("GET", `user/update/email/${umEmail}`, null, response => {
            setMessage(response.result);
            setUMEmail("");
            setState(ProfileState.SHOW);
        });
    };

    return <div className="app">
        <Navbar user={user} setUser={setUser} />
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
                        </> || (state == ProfileState.EDIT_BASIC) && <>
                            <div className="field">
                                <label>Name:</label>
                                <div className="control">
                                    <input className="input" type="text"
                                        value={ubName} onChange={element => setUBName(element.target.value)} />
                                </div>
                            </div>
                            <div className="field">
                                <label>Phone:</label>
                                <div className="control">
                                    <input className="input" type="number"
                                        value={ubPhone} onChange={element => setUBPhone(element.target.value)} />
                                </div>
                            </div>
                        </> || (state == ProfileState.EDIT_PASSWORD) && <>
                            <div className="field">
                                <label>Current password:</label>
                                <div className="control">
                                    <input className="input" type="password"
                                        value={upPassword} onChange={element => setUPPassword(element.target.value)} />
                                </div>
                            </div>
                            <div className="field">
                                <label>New password:</label>
                                <div className="control">
                                    <input className="input" type="password"
                                        value={upNewPassword} onChange={element => setUPNewPassword(element.target.value)} />
                                </div>
                            </div>
                            <div className="field">
                                <label>Confirm password:</label>
                                <div className="control">
                                    <input className="input" type="password"
                                        value={upConfirmPassword} onChange={element => setUPConfirmPassword(element.target.value)} />
                                </div>
                            </div>
                        </> || (state == ProfileState.EDIT_EMAIL) && <>
                            <div className="field">
                                <label>New email:</label>
                                <div className="control">
                                    <input className="input" type="email"
                                        value={umEmail} onChange={element => setUMEmail(element.target.value)} />
                                </div>
                            </div>
                        </>}
                        {(message != "") && <>
                            <div className="field">
                                <label>{message}</label>
                            </div>
                        </>}
                    </div>
                </div>
                <footer className="card-footer">
                    {(state == ProfileState.SHOW) && <>
                        <a role="button" className="card-footer-item" 
                            onClick={() => clickUpdateType(ProfileState.EDIT_BASIC)}>Update</a>
                        <a role="button" className="card-footer-item" 
                            onClick={() => clickUpdateType(ProfileState.EDIT_PASSWORD)}>Update password</a>
                        <a role="button" className="card-footer-item"
                            onClick={() => clickUpdateType(ProfileState.EDIT_EMAIL)}>Update email</a>
                    </> ||
                    (state == ProfileState.EDIT_BASIC || 
                    state == ProfileState.EDIT_PASSWORD || 
                    state == ProfileState.EDIT_EMAIL) && <>
                        <a role="button" className="card-footer-item has-text-danger"
                            onClick={() => clickUpdateType(ProfileState.SHOW)}>Cancel</a>
                        <a role="button" className="card-footer-item"
                            onClick={() => {
                                if (state == ProfileState.EDIT_BASIC) clickUpdateBasic();
                                else if (state == ProfileState.EDIT_PASSWORD) clickUpdatePassword();
                                else if (state == ProfileState.EDIT_EMAIL) clickUpdateEmail();
                            }}>Apply</a>
                    </>}
                </footer>
            </div>
        </div>}
    </div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Profile />);