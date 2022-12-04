import React, { useState } from "react";
import './Tabs.css';
import FirstTab from "../../components/ProfileTabs/FirstTab";
import SecondTab from "../../components/ProfileTabs/SecondTab";
import ThirdTab from "../../components/ProfileTabs/ThirdTab";

const Tabs = ({payment_info, subscription}) => {
    const [isHover, setIsHover] = useState(false);
    const handleMouseOver = () => {
        setIsHover(true);
    };

    const handleMouseOut = () => {
        setIsHover(false);
    };


    const [activeTab, setActiveTab] = useState("tab1");
    const handleTab1 = () => {
        setActiveTab("tab1");
    };
    const handleTab2 = () => {
        setActiveTab("tab2");
    };
    const handleTab3 = () => {
        setActiveTab("tab3");
    };
    var content = "";
    if (activeTab === 'tab1'){
        content = <FirstTab payment_info={payment_info}
                            subscription={subscription}/>;
    }else if (activeTab === 'tab2'){
        content = <SecondTab/>;
    }else{
        content = <ThirdTab/>;
    }
    return (
        <div className={"tabs " + (isHover ? 'shadow' : 'shadow-sm')} 
                onMouseOver={handleMouseOver} 
                onMouseOut={handleMouseOut}>
            <div className="tab-list-center">
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
            </div>
            <div className="outlet">
                {content}
            </div>
        </div>
    );
};

export default Tabs;