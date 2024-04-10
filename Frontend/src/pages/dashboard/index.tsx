import React, { useState, useEffect, ChangeEvent } from "react";
import ReactDOM from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid"
import moment from "moment"

import { Api } from "../../core/api"
import { User } from "../../core/models/user"
import { Note } from "../../core/models/note"

import { Navbar } from "./shared/navbar"

import "./index.scss";

document.title = "Dashboard";

const Dashboard = () => {
    const [user, setUser] = useState<User>();

    const [list, setList] = useState<Array<{
        isSelect: boolean,
        note: Note
    }>>([]);
    const [listOriginal, setListOriginal] = useState<Array<{
        isSelect: boolean,
        note: Note
    }>>([]);
    const [item, setItem] = useState<Note>();
    const [itemOriginal, setItemOriginal] = useState<Note>();

    const [search, setSearch] = useState<string>("");

    const [modal, setModal] = useState<{
        show: boolean,
        title?: string,
        message?: string, 
        buttons?: any
    }>({ show: false });

    useEffect(() => {
        Api.Init("GET", "note/get/list", null, response => {
            if (response.status != 200) return;

            const array: Array<any> = JSON.parse(response.result);
            const notes = new Array<{
                isSelect: boolean,
                note: Note
            }>();
            array.forEach(note => notes.push({
                isSelect: false,
                note: new Note(note.id, note.title, "",
                    moment(note.date, "YYYY-MM-DD'T'HH:mm").toDate())
            }));
            setList(notes);
            setListOriginal(notes);
        });
    }, []);

    const onChangeSearch = (element: ChangeEvent<HTMLInputElement>) => {
        const value = element.target.value;
        setSearch(value);

        if (value == "") {
            setList(listOriginal);
            return;
        }

        setList(listOriginal.filter(item => item.note.title.indexOf(value) != -1));
    };
    const clickCreateNote = () => {
        if (item) {
            if (itemOriginal) {
                if (item.title != itemOriginal.title ||
                    item.description != itemOriginal.description ||
                    item.date != itemOriginal.date) {
                    let click = (con: boolean) => {
                        setModal({ show: false });

                        if (con) {
                            setItem(new Note(uuid().toString(), "", "", new Date()));
                            setItemOriginal(undefined);
                        }
                    };
                    setModal({
                        show: true,
                        title: "Warning",
                        message: "Will the changes made so far be lost?",
                        buttons: <>
                            <button className="button"
                                onClick={() => click(false)}>No</button>
                            <button className="button"
                                onClick={() => click(true)}>Yes</button>
                        </>
                    });

                    return;
                }
            }
        }

        setItem(new Note(uuid().toString(), "", "", new Date()));
        setItemOriginal(undefined);
    };
    const clickRemoveSelects = () => {
        const click = (remove: boolean) => {
            setModal({ show: false });
            if (!remove) return;

            const ids: Array<string> = list
                .filter(item => item.isSelect)
                .map(item => item.note.id);
            Api.Init("DELETE", "note/remove", ids, response => {
                setModal({
                    show: true, 
                    title: "Remove notes", 
                    message: response.result
                });

                if (response.status == 200) {
                    if (item) {
                        const exists = ids.find(id => item.id == id);
                        if (exists) {
                            setItem(undefined);
                            setItemOriginal(undefined);
                        }
                    }
                    setList(list.filter(item => {
                        const exists = ids.find(id => item.note.id == id);
                        return !exists;
                    }));
                }
            });
        };
        setModal({
            show: true, 
            title: "Warning", 
            message: "Remove notes selected?", 
            buttons: <>
                <button className="button" 
                    onClick={() => click(false)}>No</button>
                <button className="button"
                    onClick={() => click(true)}>Yes</button>
            </>
        });
    };
    const clickNote = (id: string) => {
        Api.Init("GET", `note/get/item/${id}`, null, response => {
            if (response.status != 200) return;

            const jNote = JSON.parse(response.result);
            const note = new Note(jNote.id, jNote.title, jNote.description,
                moment(jNote.date, "YYYY-MM-DD'T'HH:mm").toDate());
            setItem(note);
            setItemOriginal(note);
        });
    }
    const onChangeSelect = (id: string) => {
        setList(list.map(item => {
            if (item.note.id == id) {
                return {
                    isSelect: !item.isSelect,
                    note: item.note
                };
            }

            return item;
        }));
    }
    const clickCancel = () => {
        if (item) {
            if (itemOriginal) {
                if (item.title != itemOriginal.title ||
                    item.description != itemOriginal.description ||
                    item.date != itemOriginal.date) {
                    let click = (con: boolean) => {
                        setModal({ show: false });

                        if (con) {
                            setItem(undefined);
                            setItemOriginal(undefined);
                        }
                    };
                    setModal({
                        show: true,
                        title: "Warning",
                        message: "Will the changes made so far be lost?", 
                        buttons: <>
                            <button className="button"
                                onClick={() => click(false) }>No</button>
                            <button className="button"
                                onClick={() => click(true) }>Yes</button>
                        </>
                    });

                    return;
                }
            }
        }

        setItem(undefined);
        setItemOriginal(undefined);
    };
    const clickRemove = (id: string) => {
        const click = (remove: boolean) => {
            setModal({ show: false });
            if (!remove) return;

            Api.Init("DELETE", `note/remove/${id}`, null, response => {
                setModal({
                    show: true, 
                    title: "Remove note", 
                    message: response.result
                });

                if (response.status == 200) {
                    setItem(undefined);
                    setItemOriginal(undefined);
                    setList(list.filter(item => item.note.id != id));
                }
            });
        };
        setModal({
            show: true,
            title: "Warning", 
            message: "Remove this note?", 
            buttons: <>
                <button className="button"
                    onClick={() => click(false)}>No</button>
                <button className="button"
                    onClick={() => click(true)}>Yes</button>
            </>
        });
    };
    const clickSave = () => {
        if (item.title == "" || 
            item.description == "") {
            let message = "";
            
            if (item.title == "") message += "Title";
            if (item.description == "") message += ((item.title == "") ? " and description are " : "Description is ");

            setModal({ show: true, title: "Warning", message: message + "required" });

            return;
        }

        Api.Init("POST", "note/add", item.toMap(), response => {
            setModal({ show: true, title: "Note", message: response.result });

            if (response.status == 201) {
                setItemOriginal(item);
                setList([{ isSelect: false, note: item }, ...list]);
            }
        });
    };
    const clickUpdate = () => {
        if (item.title == "" || 
            item.description == "") {
            let message = "";

            if (item.title == "") message += "Title";
            if (item.description == "") message += ((item.title == "") ? " and description are " : "Description is ");

            setModal({ show: true, title: "Warning", message: message + "required" });
            return;
        }

        Api.Init("PUT", "note/update", item.toMap(), response => {
            setModal({ show: true, title: "Note", message: response.result });

            if (response.status == 200) {
                setItemOriginal(item);
                setList(list.map(itm => {
                    if (itm.note.id == item.id)
                        return { isSelect: false, note: item };

                    return itm;
                }));
            }
        });
    };

    return <div className="app">
        <Navbar user={user} setUser={setUser} />
        <div className="dashboard">
            <div className="list">
                <div className="commands">
                    <div className="field has-addons">
                        <div className="control has-icons-right">
                            <input className="input" type="search" placeholder="Search"
                                value={search} onChange={onChangeSearch} />
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
                        {(list.findIndex(i => i.isSelect) != -1) && <div className="control">
                            <button className="button"
                                onClick={clickRemoveSelects}>
                                <FontAwesomeIcon icon={faTrash} color="red" />
                            </button>
                        </div>}
                    </div>
                </div>
                {(list.length > 0) && <ul className="notes">
                    {list.map(item => <li key={item.note.id} className="note">
                        <input type="checkbox"
                            checked={item.isSelect}
                            onChange={_ => onChangeSelect(item.note.id)} />
                        <div className="info"
                            onClick={() => clickNote(item.note.id)}>
                            <label>{item.note.title}</label>
                            <small>{moment(item.note.date).format("DD/MM/YYYY HH:mm")}</small>
                        </div>
                    </li>)}
                </ul> || <div className="noNotes">
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
                                        value={moment(item.date).format("YYYY-MM-DD")}
                                        onChange={element => setItem(item.setDate(
                                            moment(element.target.value, "YYYY-MM-DD").toDate()))} />
                                </div>
                            </div>
                        </div>
                        <div className="buttons">
                            <button className="button"
                                onClick={clickCancel}>Cancel</button>
                            {(itemOriginal) && <button className="button"
                                onClick={() => clickRemove(item.id)}>Remove</button>}
                            <button className="button"
                                onClick={() => {
                                    if (!itemOriginal) clickSave();
                                    else clickUpdate();
                                }}>
                                {(!itemOriginal) ? "Save" : "Update"}
                            </button>
                        </div>
                    </div>
                </div> || <div className="noItem">
                    <label>No note selected. Create a note or select a note to edit.</label>
                </div>}
            </div>
        </div>

        <div className={(modal.show) ? "modal is-active" : "modal"}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{modal.title}</p>
                    <button className="delete" aria-label="close"
                        onClick={() => setModal({ show: false })}></button>
                </header>
                <section className="modal-card-body">
                    <label>{modal.message}</label>
                </section>
                <footer className="modal-card-foot">
                    <div className="buttons">
                        {(modal.buttons) && modal.buttons || <>
                            <button className="button"
                                onClick={() => setModal({ show: false })}>Ok</button>
                        </>}
                    </div>
                </footer>
            </div>
        </div>
    </div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Dashboard />);