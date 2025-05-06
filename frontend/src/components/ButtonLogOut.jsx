import React from "react";
import useLogOut from "../hooks/useLogOut";

export default function ButtonLogOut() {
    const logout = useLogOut();
    return (
        <button className="btn btn-danger" onClick={logout}>
            Log Out
        </button>
    );
}