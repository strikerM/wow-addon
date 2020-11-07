import React from 'react';

interface ISettings {
    onWowFolderSetClick(): void;
    onWowFolderChange(value: string): void;
    wowFolderInputValue: string;
};

export default function Settings({ onWowFolderSetClick, onWowFolderChange, wowFolderInputValue }: ISettings) {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => onWowFolderChange(e.target.value);
    
    return (
        <>
            <h3 className="title is-3">Wow Folder</h3>
            <div className="field-body">
                <div className="field">
                    <p className="control">
                        <input className="input" type="text" placeholder="Set WoW Folder" onChange={onChange} value={wowFolderInputValue} />
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <button className="button is-primary" onClick={onWowFolderSetClick}>Set</button>
                    </p>
                </div>
            </div>

        </>
    );
}