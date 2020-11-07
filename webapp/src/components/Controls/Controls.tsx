import React, { useEffect } from 'react';

interface IControlProps {
    activeTab: string;
    isRefreshing: boolean;
    onRefresh(): void;
    setProvider(value: string): void;
    setSearchTerm(value: string): void;
}

export default React.memo(function Controls({ onRefresh, setProvider, activeTab, isRefreshing, setSearchTerm }: IControlProps) {

    const searchInputOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode !== 13) {
            return;
        }

        const input = e.target as HTMLInputElement;
        setSearchTerm(input.value);
    }

    const refreshButtonClassList = `button is-info is-rounded ${isRefreshing ? 'is-loading' : ''}`;

    useEffect(() => {
        console.log('render Controls', activeTab, isRefreshing);
    });

    return (
        <section className="section">
            <div className="container">
                <div className="columns">
                    <div className="column">
                        <button className={refreshButtonClassList} onClick={onRefresh} disabled={activeTab !== 'my-addons'}>Refresh</button>
                    </div>
                    <div className="column">
                        <div className="columns">
                            <div className="column" style={{ flexGrow: 0, paddingRight: 1 }}>
                                <div className="select">
                                    <select name="provider" onChange={(e) => setProvider(e.target.value)} disabled={activeTab !== 'find-addons'}>
                                        <option value="curse">Curse</option>
                                        <option value="elvui">ElvUi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="column" style={{ paddingLeft: 0 }}>
                                <input className="input" type="text" placeholder="Search" onKeyDown={searchInputOnEnter} disabled={activeTab !== 'find-addons'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});