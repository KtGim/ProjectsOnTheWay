import React from 'react';
import { Modal } from 'wmstool';
import { KEYS_DESCRIPTION } from './const';

const ShortCutKeysDescModal = ({ onCancel, title, txt }) => {
    console.log('txt', txt);
    const renderItem = ({desc, keys}, index) => {
        return <p key={index} className="item">
            <span className="lineNo">{index + 1}</span>
            <span className="title">{txt[desc]}</span>
            <span className="keys">{keys}</span>
        </p>;
    };
    return <Modal
        visible
        title={title}
        onCancel={onCancel}
        onOk={onCancel}
        className="shortcut_keys_modal"
    >
        <div>
            {
                KEYS_DESCRIPTION.map(renderItem)
            }
        </div>
    </Modal>;
};

export default ShortCutKeysDescModal;