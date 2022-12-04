import React, { useState } from "react";
import './Tabs.css';
import FirstTab from "../../components/ProfileTabs/FirstTab";
import SecondTab from "../../components/ProfileTabs/SecondTab";
import ThirdTab from "../../components/ProfileTabs/ThirdTab";

const Tabs = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    //  Functions to handle Tab Switching
    const handleTab1 = () => {
        // update the state to tab1
        setActiveTab("tab1");
    };
    const handleTab2 = () => {
        // update the state to tab2
        setActiveTab("tab2");
    };
    const handleTab3 = () => {
        // update the state to tab3
        setActiveTab("tab3");
    };

    var content = "";
    if (activeTab === 'tab1'){
        content = <FirstTab />;
    }else if (activeTab === 'tab2'){
        content = <SecondTab />;
    }else{
        content = <ThirdTab />;
    }
    return (
        <div className="tabs">
            <div className="tab-list">
                <button className={(activeTab === "tab1" ? "active" : "") + " tab-btn"} onClick={handleTab1}>
                    Account Info
                </button>
                <button className={(activeTab === "tab2" ? "active" : "") + " tab-btn"} onClick={handleTab2}>
                    Classes
                </button>
                <button className={(activeTab === "tab3" ? "active" : "") + " tab-btn"} onClick={handleTab3}>
                    Payment History
                </button>
            </div>
            <div className="outlet">
                {content}
            </div>
        </div>
    );
};

export default Tabs;