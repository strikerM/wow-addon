import React, { useEffect } from 'react';

interface INavbarProps {
    setActiveTab(value: string): void;
    setClientType(value: string): void;
}

export default React.memo(function Navbar({ setActiveTab, setClientType }: INavbarProps) {

    const myAddonsOnClick = () => setActiveTab('my-addons');
    const findAddonsOnClick = () => setActiveTab('find-addons');
    const settingsOnClick = () => setActiveTab('settings');
    const clientTypeOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => setClientType(e.target.value);

    useEffect(() => {
        console.log('render Navbar');
    });

    return (
        <section className="section">
            <div className="container">
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <div className="navbar-menu">
                        <div className="navbar-start">
                            <a className="navbar-item" onClick={myAddonsOnClick}>My Addons</a>
                            <a className="navbar-item" onClick={findAddonsOnClick}>Find Addons</a>
                            <a className="navbar-item" onClick={settingsOnClick}>Settings</a>
                        </div>
                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="select">
                                    <select name="clientType" onChange={clientTypeOnChange}>
                                        <option value="retail">Retail</option>
                                        <option value="classic">Classic</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
});