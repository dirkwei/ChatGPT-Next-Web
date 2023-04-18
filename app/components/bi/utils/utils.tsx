// a function generate antd table columns
// param type is ResultRoot interface
import {ColumnsType} from "antd/es/table";
import {ResultRoot} from "@/app/components/bi/types";
import {cloneDeep} from "lodash-es";
import {Space} from "antd";
import {Tooltip} from "recharts";

export const icons = [
  'https://yunke-oss.oss-cn-hangzhou.aliyuncs.com/tools/brick/process/top1.svg',
  'https://yunke-oss.oss-cn-hangzhou.aliyuncs.com/tools/brick/process/top2.svg',
  'https://yunke-oss.oss-cn-hangzhou.aliyuncs.com/tools/brick/process/top3.svg',
]


export const columnCommon = [
  {
    title: '排名',
    key: '排名',
    dataIndex: '排名',
    render: (_, record, index) => <div>{index}</div>,
    renderWithCtx: (ctx, _, record, index) => {
      const {current, pageSize} = ctx.pagination

      if (current === 1 && index < 3) {
        return <div><img src={icons[index]} alt=""/></div>
      }

      const rank = [current - 1] * pageSize + index + 1

      return <div>{`${rank < 6 ? 'TOP ' : ''}${rank}`}</div>
    },
    exportRender: (_, record, index) => {
      return String(index + 1)
    }
  },
]

export const genColumns = (type: ResultRoot): ColumnsType<any>[] => {
  const columns: any[] = [
    ...columnCommon,
  ];
  // get dimensions and dimension keys from annotation
  // annotation.dimensions is an key-value object
  // key is dimension name, value is dimension item
  const dimensions = type.annotation.dimensions;
  const dimensionKeys = Object.keys(dimensions);
  // get measures and measure keys from annotation,
  // annotation.measures is an key-value object
  // key is measure name, value is measure item
  const measures = type.annotation.measures;
  const measureKeys = Object.keys(measures);
  // generate columns
  dimensionKeys.forEach((key) => {
    columns.push({
      title: dimensions[key].shortTitle,
      dataIndex: key,
      key,
    } as any);
  })

  measureKeys.forEach((key) => {
    columns.push({
      title: measures[key].shortTitle,
      dataIndex: key,
      key,
      sorter: (a, b) => a[key] - b[key],
      render: (text, record) => {
        return text || 0
      }
    } as any);
  })

  return columns;
}

export const customColumnRender = (columns: any[], ctx: Record<any, any>) => {
  const cloned = cloneDeep(columns)

  return cloned?.map(item => {
    if (item.renderWithCtx) {
      item.render = (...args) => item.renderWithCtx(ctx, ...args)
    }

    if (item.titleTip) {
      item.title = <Space>
        {item.title}
        <Tooltip title={<div style={{whiteSpace: "pre-line"}}>{item.titleTip}</div>} placement="bottom">
          <QuestionCircleOutlined />
        </Tooltip>
      </Space>
    }

    return item
  })
}
