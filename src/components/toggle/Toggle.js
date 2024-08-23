import React from "react";
import { useState } from "react";
import "./Toggle.scss";

export function Toggle({ onChange, value }) {
    const [val, setVal] = useState(value);
    const toggle = () => {
        onChange(!val);
        setVal(!val);
    };

    return (
        <div className={"comp-toggle" + (val ? " active" : "")} onClick={() => toggle()}>
            <div className="thumb"></div>
        </div>
    );
}
