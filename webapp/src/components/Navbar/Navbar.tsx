import React from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTab, setClientType } from '../../store';

export default React.memo(function Navbar() {
    console.log('render Navbar');
    const dispatch = useDispatch();

    const myAddonsOnClick = () => dispatch(setActiveTab('my-addons'));
    const findAddonsOnClick = () => dispatch(setActiveTab('find-addons'));
    const settingsOnClick = () => dispatch(setActiveTab('settings'));
    const clientTypeOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(setClientType(e.target.value));

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