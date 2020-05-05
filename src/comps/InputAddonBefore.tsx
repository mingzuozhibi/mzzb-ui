import React from "react";

export interface InputAddonBeforeProps {
    addonBefore: React.ReactNode
    children: React.ReactNode
}

export function InputAddonBefore({ addonBefore, children }: InputAddonBeforeProps) {
    return (
        <span className="ant-input-group-wrapper">
            <span className="ant-input-wrapper ant-input-group">
                <span className="ant-input-group-addon">{addonBefore}</span>
                {children}
            </span>
        </span>
    )
}