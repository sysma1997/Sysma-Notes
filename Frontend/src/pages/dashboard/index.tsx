import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAdd } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid"

import { Api } from "../../core/api"
import { User } from "../../core/models/user"
import { Note } from "../../core/models/note"

import { Navbar } from "./shared/navbar"

import "./index.scss";

document.title = "Dashboard";

const Dashboard = () => {
    const [user, setUser] = useState<User>();

    const [list, setList] = useState<Array<Note>>([]);
    const [item, setItem] = useState<Note>();

    const clickCreateNote = () => {
        setItem(new Note(uuid().toString(), "", "", new Date()));
    };
    const clickCancel = () => {
        //
    };
    const clickSave = () => {
        //
    };

    return <div className="app">
        <Navbar user={user} setUser={setUser} />
        <div className="dashboard">
            <div className="list">
                <div className="commands">
                    <div className="field has-addons">
                        <div className="control has-icons-right">
                            <input className="input" type="search" placeholder="Search" />
                            <FontAwesomeIcon className="icon is-small is-right"
                                icon={faSearch} style={{
                                    width: "1.3rem", 
                                    marginRight: "0.3rem"
                                }} />
                        </div>
                        <div className="control">
                            <button className="button"
                                onClick={clickCreateNote}>
                                <FontAwesomeIcon icon={faAdd} />
                            </button>
                        </div>
                    </div>
                </div>
                {(list.length > 0) && <div className="notes">
                </div> || <div className="noNotes">
                    <label>Noting note created.</label>
                </div>}
            </div>
            <div className="item">
                {(item) && <div className="note">
                    <div className="field">
                        <div className="control">
                            <input className="input" type="text" placeholder="Title"
                                value={item.title}
                                onChange={element => setItem(item.setTitle(element.target.value))} />
                        </div>
                    </div>
                    <textarea className="textarea" placeholder="Description"
                        value={item.description}
                        onChange={element => setItem(item.setDescription(element.target.value))} />
                    <div className="commands">
                        <div>
                            <div className="field">
                                <div className="control">
                                    <input className="input" type="date"
                                        value={item.date.toStr} />
                                </div>
                            </div>
                        </div>
                        <div className="buttons">
                            <button className="button"
                                onClick={clickCancel}>Cancel</button>
                            <button className="button"
                                onClick={clickSave}>Save</button>
                        </div>
                    </div>
                </div> || <div className="noItem">
                    <label>No note selected. Create a note or select a note to edit.</label>
                </div>}
            </div>
        </div>
    </div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Dashboard />);