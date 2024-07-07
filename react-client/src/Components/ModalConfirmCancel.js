import { ModalTemplate } from "../Templates/Modal";
import React from "react";
export function ModalConfirmCancel({ isShown, title, text, onConfirm, onCancel }) {
    return (
        <ModalTemplate onClose={onCancel} isShown={isShown}>
            <h4>{title}</h4>
            <hr />
            <p>{text}</p>
            <div className="flex justify-between mt-3">
                <button className="button-standard-blue-grey" onClick={onCancel}>Cancel</button>
                <button className="button-standard" onClick={onConfirm}>Confirm</button>
            </div>
        </ModalTemplate>
    );
}