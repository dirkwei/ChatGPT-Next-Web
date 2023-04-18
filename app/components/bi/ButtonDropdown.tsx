import React from "react";
import { Dropdown, DropDownProps, ButtonProps, Button } from "antd";

// import { Button } from "../atoms";

const ButtonDropdown = ({
  disabled = false,
  overlay,
  ...buttonProps
}: DropDownProps & ButtonProps) => {
  return (
    <Dropdown
      disabled={disabled}
      overlay={overlay}
      placement="bottomLeft"
      trigger={["click"]}
    >
      <Button {...buttonProps} disabled={disabled} />
    </Dropdown>
  );
};

export default ButtonDropdown;
