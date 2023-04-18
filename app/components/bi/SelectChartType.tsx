import React from "react";
import { Menu } from "antd";
import {
  LineChartOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  TableOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import ButtonDropdown from "./ButtonDropdown";

const StyledMenuItem = Menu.Item

const ChartTypes = [
  { name: "line", title: "折线图", icon: <LineChartOutlined /> },
  // { name: "area", title: "面积图", icon: <AreaChartOutlined /> },
  { name: "bar", title: "柱状图", icon: <BarChartOutlined /> },
  { name: "pie", title: "饼图", icon: <PieChartOutlined /> },
  { name: "table", title: "表格", icon: <TableOutlined /> },
  { name: "number", title: "数字", icon: <InfoCircleOutlined /> },
];

const SelectChartType = ({ chartType, updateChartType }) => {
  const menu = (
    <Menu data-testid="chart-type-dropdown">
      {ChartTypes.map((m) => (
        <StyledMenuItem key={m.title} onClick={() => updateChartType(m.name)} >
          {m.icon} {m.title}
        </StyledMenuItem>
      ))}
    </Menu>
  );

  const foundChartType = ChartTypes.find((t) => t.name === chartType);
  return (
    <ButtonDropdown
      data-testid="chart-type-btn"
      icon={foundChartType?.icon}
      overlay={menu}
      style={{ border: 0 }}
      size={"small"}
    >
      {foundChartType?.title || ""}
    </ButtonDropdown>
  );
};

export default SelectChartType;
