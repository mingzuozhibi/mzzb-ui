import React from "react";

export interface InputAddonBeforeProps {
  addonBefore: React.ReactNode
  children: React.ReactNode
  marginRight?: number
}


export function InputAddonBefore({ addonBefore, marginRight, children }: InputAddonBeforeProps) {
  const spanProps: any = {}
  if (marginRight) {
    spanProps.style = { border: '1px solid #d9d9d9', borderRadius: 2 }
  }
  return (
    <span className="ant-input-group-wrapper">
      <span className="ant-input-wrapper ant-input-group">
        <span className="ant-input-group-addon" {...spanProps}>{addonBefore}</span>
        {marginRight && <span style={{ minWidth: marginRight, display: 'inline-block  ' }}></span>}
        {children}
      </span>
    </span>
  )
}
