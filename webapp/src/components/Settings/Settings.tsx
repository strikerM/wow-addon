import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IStoreState, setWowFolderInput, setWowFolder, fetchSettings } from '../../store';

export default function Settings() {
    console.log('render Settings');

    const dispatch = useDispatch();
    const wowFolderInput = useSelector((state: IStoreState) => state.wowFolderInput);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setWowFolderInput(e.target.value));
    const onSetClick = () => dispatch(setWowFolder());

    useEffect(() => {
        dispatch(fetchSettings());
    }, []);

    return (
        <>
            <h3 className="title is-3">Wow Folder</h3>
            <div className="field-body">
                <div className="field">
                    <p className="control">
                        <input className="input" type="text" placeholder="Set WoW Folder" onChange={onChange} value={wowFolderInput} />
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <button className="button is-primary" onClick={onSetClick}>Set</button>
                    </p>
                </div>
            </div>

        </>
    );
}