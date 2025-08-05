import React, { useState } from "react";
import { FaBroadcastTower, FaBrush, FaCog, FaCogs, FaList, FaSquare } from "react-icons/fa";
import { VscArrowLeft } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import packageJSON from "../../../package.json";
import model from "../../resources/model/model";
import "./SettingsPage.scss";
import AdvancedSettings from "./sections/Advanced";
import BehaviorSettings from "./sections/Behavior";
import ButtonsSection from "./sections/Buttons";
import SessionSettings from "./sections/Session";
import VisualSettings from "./sections/Visual";
import CollectionsSettings from "./sections/Collections";

export default function SettingsPage() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);

    const [showNSFW, setNSFW] = useState(-5);

    const sections = [
        {
            title: "Visual Settings",
            element: <VisualSettings />,
            icon: <FaBrush />,
        },
        { title: "Behavior", element: <BehaviorSettings />, icon: <FaCog /> },
        { title: "Buttons", element: <ButtonsSection />, icon: <FaSquare /> },
        {
            title: "Session",
            element: <SessionSettings />,
            icon: <FaBroadcastTower />,
        },
        { title: "Advanced", element: <AdvancedSettings showNSFW={showNSFW > 0} />, icon: <FaCogs /> },
        { title: "Collections", element: <CollectionsSettings />, icon: <FaList /> },
    ];

    return (
        <div id="settings">
            <h1 onClick={() => setNSFW(showNSFW + 1)}>
                Settings
                <VscArrowLeft onClick={() => navigate(-1)} />
            </h1>
            <div className="grid">
                <div className="left">
                    {sections.map((section, key) => (
                        <div className="item" onClick={() => setSelected(key)}>
                            {section.icon} {section.title}
                        </div>
                    ))}
                </div>
                <div className="right">
                    <h2>{sections[selected].title}</h2>
                    {sections[selected].element}
                </div>
            </div>

            <hr />

            <div className="info">
                <p>
                    There are currently {model.songCount} songs. ({model.songs.length} displayed)
                </p>
                <p>Version {packageJSON.version}</p>
            </div>
        </div>
    );
}
