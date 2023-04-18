import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import PivotTable from './WebDataRocks'
import {Spin, Button, Select, Space} from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
// import './ChartRenderer.css'
// import Drilldown from './Drilldown'

import {
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts'
// import { useDeepCompareMemo } from 'use-deep-compare'
// import NumberChart from './chartComponents/NumberChart'
// import { useChainComparison } from './hooks'
import _, { filter, findIndex, isEmpty, last, map, pick } from 'lodash-es'
// import SyncChartData from './SyncChartData'
import { useDebounceEffect, useUpdateEffect } from 'ahooks'
import queryString from 'query-string'
import {ResultRoot} from "@/app/components/bi/types";
import NumberChart from "@/app/components/bi/chartComponents/NumberChart";
import {genColumns} from "@/app/components/bi/utils/utils";
import Brick from "@/app/components/bi/chartComponents/table/brick";
import {autoChartType} from "@/app/components/bi/utils/auto-chart-type";
import {genExportData, onExportBasicExcel} from "@/app/components/bi/chartComponents/table/export-table";
import SelectChartType from "@/app/components/bi/SelectChartType";

// const syncChartDataIns = new SyncChartData()

// 导出数据
const exportData = (data: ResultRoot) => {
  const c = genColumns(data)
  exportWithCustomConfig(c, data.data)
}

// 导出表格
const exportWithCustomConfig=(columns: any[], list: any[]) => {
  const result = genExportData(columns, list)
  onExportBasicExcel(columns, result, '新建文件')
}

const CartesianChart = ({ ChartComponent, children, legendMap, legendMapChange, onChartComponentClick, resultSet, dimensionKey }) => {
  const legendClick = (legendObj) => {
    legendMap[legendObj.dataKey] = !legendMap[legendObj.dataKey]
    legendMapChange(JSON.parse(JSON.stringify(legendMap)))
  }
  return (
    <ResponsiveContainer minHeight={400}>
      {/*<ChartComponent data={resultSet.data} onClick={onChartComponentClick}>*/}
      <ChartComponent data={resultSet.data}>
        <XAxis dataKey={dimensionKey || resultSet.queries[0].dimensions[0]} />
        <YAxis />
        <Tooltip />
        <CartesianGrid />
        {children}
        <Legend onClick={legendClick} />
      </ChartComponent>
    </ResponsiveContainer>
  )
}

const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
const formatTableData = (columns, data) => {
  function flatten(columns = []) {
    return columns.reduce((memo, column) => {
      if (column.children) {
        return [...memo, ...flatten(column.children)]
      }
      return [...memo, column]
    }, [])
  }

  const typeByIndex = flatten(columns).reduce((memo, column) => {
    if (!column.title && column.dataIndex.indexOf('time.') == 0) {
      column.title = '时间'
    }
    return {
      ...memo,
      [column.dataIndex]: column,
    }
  }, {})

  function formatValue(value, { format, type } = {}) {
    if (value == undefined) {
      return value
    }
    if (type === 'boolean') {
      if (typeof value === 'boolean') {
        return value.toString()
      } else if (typeof value === 'number') {
        return Boolean(value).toString()
      }
      return value
    }
    if (type === 'number' && format === 'percent') {
      return [parseFloat(value).toFixed(2), '%'].join('')
    }
    return value.toString()
  }

  function format(row) {
    return Object.fromEntries(
      Object.entries(row).map(([dataIndex, value]) => {
        const column = typeByIndex[dataIndex]
        return [column.title || column.key, formatValue(value, typeByIndex[dataIndex])]
      }),
    )
  }

  return data.map(format)
}

// 生成最终跳转时需要的rawData
const getFinalDrillDownLinkPayload = (resultSet, xValues) => {
  const resultSetQuery = resultSet.query()
  const filterKeys = []
  if (!isEmpty(resultSetQuery.timeDimensions)) {
    resultSetQuery.timeDimensions.map((d) => {
      const key = Boolean(d.granularity) ? `${d.dimension}.${d.granularity}` : d.dimension
      filterKeys.push(key)
    })
  } else {
    filterKeys.push(resultSetQuery.dimensions)
  }

  const filterObj = {}
  filterKeys.forEach((key, index) => {
    filterObj[key] = xValues[index]
  })

  return filter(resultSet.rawData(), filterObj)
}

const TypeToChartComponent = {
  line: ({ drillDown, legendMap, legendMapChange, resultSet, setDrillDownLocatorWrapper }) => {
    return (
      <CartesianChart
        ChartComponent={LineChart}
        legendMap={legendMap}
        legendMapChange={legendMapChange}
        resultSet={resultSet}
        dimensionKey={resultSet.annotation.timeDimensions[0]?.dimension}
      >
        {Object.keys(resultSet.annotation.measures).map((measure, i) => (
          <Line
            // activeDot={{
            //   onClick: (_, event) => {
            //     const finalPayload = getFinalDrillDownLinkPayload(resultSet, event.payload.xValues)
            //     setDrillDownLocatorWrapper(event.payload.xValues, series.yValues, drillDown, finalPayload)
            //   },
            // }}
            dataKey={measure}
            hide={legendMap[measure]}
            key={measure}
            name={resultSet.annotation.measures[measure].shortTitle}
            stackId="a"
            stroke={colors[i % colors.length]}
          />
        ))}
      </CartesianChart>
    )
  },
  bar: ({ drillDown, legendMap, legendMapChange, resultSet, setDrillDownLocatorWrapper }) => {
    return (
      <CartesianChart
        ChartComponent={BarChart}
        legendMap={legendMap}
        legendMapChange={legendMapChange}
        resultSet={resultSet}
        dimensionKey={resultSet.annotation.timeDimensions[0]?.dimension}
      >
        {Object.keys(resultSet.annotation.measures).map((measure, i) => (
          <Bar
            dataKey={measure}
            fill={colors[i % colors.length]}
            hide={legendMap[measure]}
            key={measure}
            name={resultSet.annotation.measures[measure].shortTitle}
            // onClick={(e) => {
            //   const finalPayload = getFinalDrillDownLinkPayload(resultSet, e.xValues)
            //   setDrillDownLocatorWrapper(e.xValues, series.yValues, drillDown, finalPayload)
            // }}
            stackId="a"
          />
        ))}
      </CartesianChart>
    )
  },
  area: ({ drillDown, legendMap, legendMapChange, resultSet, setDrillDownLocatorWrapper }) => {
    const [xValues, setXValues] = useState([])
    const [yValues, setYValues] = useState([])
    const [linkPayload, setLinkPayload] = useState({})

    const onChartClick = (e) => {
      if (isEmpty(e)) return
      // 每个activePayload item都会有一个payload，根据item.dataKey过滤payload中的measure字段
      const activePayload = e.activePayload
      if (!isEmpty(activePayload)) {
        const originalPayload = activePayload[0].payload
        const dataKeys = map(activePayload, (item) => item['dataKey'])
        const formattedPayload = pick(originalPayload, ['x', 'xValues', ...dataKeys])
        // 最后生成一个完整的payload对象，在跳转链接场景下使用
        setLinkPayload(formattedPayload)
      }

      setXValues([e.activeLabel])
    }

    const clearXYValues = () => {
      setXValues([])
      setYValues([])
      setLinkPayload({})
    }

    useDebounceEffect(
      () => {
        if (isEmpty(xValues) || isEmpty(yValues)) {
          return
        }

        const finalPayload = getFinalDrillDownLinkPayload(resultSet, xValues)
        setDrillDownLocatorWrapper(xValues, yValues, drillDown, finalPayload)
        clearXYValues()
      },
      [xValues, yValues, linkPayload],
      { wait: 50 },
    )

    return (
      <CartesianChart
        ChartComponent={AreaChart}
        legendMap={legendMap}
        legendMapChange={legendMapChange}
        onChartComponentClick={onChartClick}
        resultSet={resultSet}
      >
        {Object.keys(resultSet.annotation.measures).map((measure, i) => (
          <Area
            dataKey={measure}
            fill={colors[i % colors.length]}
            hide={legendMap[measure]}
            key={measure}
            name={resultSet.annotation.measures[measure].shortTitle}
            // onClick={() => setYValues(series.yValues)}
            stackId="a"
            stroke={colors[i % colors.length]}
          />
        ))}
      </CartesianChart>
    )
  },
  pie: ({ drillDown, resultSet, setDrillDownLocatorWrapper }) => {
    const data = resultSet as ResultRoot
    const nameKey = data.queries[0].dimensions[0]
    const dataKey = data.queries[0].measures[0]

    return (
      <ResponsiveContainer minHeight={400}>
        <PieChart>
          <Pie
            data={data.data.map((item) => ({...item, [dataKey]: Number(item[dataKey]) }))}
            dataKey={dataKey}
            fill="#8884d8"
            isAnimationActive={false}
            nameKey={nameKey}
          >
            {data.data.map((d, i) => (
              <Cell
                fill={colors[i % colors.length]}
                key={i}
                onClick={() =>
                  setDrillDownLocatorWrapper(
                    d.xValues,
                    resultSet.seriesNames()[0].yValues,
                    drillDown,
                    resultSet.rawData(),
                  )
                }
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
  },
  number: ({ canEdit, chartConfig, onChartConfigChange, resultSet }) => {
    return (
      <NumberChart
        canEdit={canEdit}
        chartConfig={chartConfig}
        onChartConfigChange={onChartConfigChange}
        resultSet={resultSet}
      />
    )
  },
  table: ({
    drillDown,
    canEdit,
    chartConfig,
    onChartConfigChange,
    pivotConfig,
    resultSet,
    setDrillDownLocatorWrapper,
  }) => {
    const c = genColumns(resultSet)
    return <Brick columns={c} resultSet={resultSet}/>
  },
}

const TypeToMemoChartComponent = Object.keys(TypeToChartComponent)
  .map((key) => ({
    [key]: React.memo(TypeToChartComponent[key]),
  }))
  .reduce((a, b) => ({
    ...a,
    ...b,
  }))

interface ChartRendererProps {
  canEdit: boolean
  vizState: Record<any, any>
  resultRoot: ResultRoot
}
const ChartRenderer = ({ canEdit, vizState, resultRoot}: ChartRendererProps) => {
  const { application, chartConfig, drillDown, pivotConfig, queries } = vizState
  const [chartType, setChartType] = React.useState(autoChartType(resultRoot))
  // const Component = TypeToMemoChartComponent[chartType]
  const Component = TypeToMemoChartComponent[chartType]

  const [resultSet, setResultSet] = React.useState(resultRoot)
  const [error, setError] = React.useState(null)
  const [legendMap, legendMapChange] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [drillDownLocator, setDrillDownLocator] = React.useState<any>(null)
  const setDrillDownLocatorWrapper = (xValues, yValues, drillDownConfig, linkPayload) => {
    // 未开启穿透时
    const measure = last(yValues)
    const index = findIndex(drillDownConfig, { name: measure })
    if (index < 0) {
      return
    }

    const drillDownItem = drillDownConfig[index]
    if (drillDownItem.type === 'none') {
      return
    }

    // 配置了跳转链接时, 在新窗口打开链接
    if (drillDownItem.type === 'link') {
      const url = `${drillDownItem.link_url}?${queryString.stringify({ payload: JSON.stringify(linkPayload) })}`
      return drillDownItem.link_url ? window.open(url, '_blank') : null
    }

    // 配置了穿透时
    setDrillDownLocator({
      xValues,
      yValues,
    })
  }

  return (
    (loading && (
      <Spin size="large" style={{ paddingTop: '50px', margin: '0 auto', display: 'block' }} tip="数据加载中..." />
    )) ||
    (resultSet && (
      <>
        {/*<GlobalStyles />*/}
        {/*{drillDownLocator ? (*/}
        {/*  <Drilldown*/}
        {/*    application={application}*/}
        {/*    drillDownLocator={drillDownLocator}*/}
        {/*    resultSet={resultSet}*/}
        {/*    timeDimensions={queries[0].timeDimensions}*/}
        {/*  />*/}
        {/*) : null}*/}
        <Component
          canEdit={canEdit}
          chartConfig={chartConfig[chartType] || {}}
          drillDown={drillDown}
          legendMap={legendMap}
          legendMapChange={legendMapChange}
          loading={loading}
          pivotConfig={pivotConfig}
          resultSet={resultSet}
          setDrillDownLocatorWrapper={setDrillDownLocatorWrapper}
        />
        <div style={{paddingTop: 10}}>
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                exportData(resultSet)
              }}
              size="small"
              style={{  }}
              title="导出数据"
            />
            <SelectChartType chartType={chartType} updateChartType={setChartType}/>
          </Space>
        </div>
        {/*<div className="handle-bar">*/}
        {/*  <Button*/}
        {/*    icon={<DownloadOutlined />}*/}
        {/*    onClick={() => {*/}
        {/*      exportData(resultSet)*/}
        {/*    }}*/}
        {/*    size="small"*/}
        {/*    style={{ marginTop: 5 }}*/}
        {/*    title="导出数据"*/}
        {/*  />*/}
        {/*</div>*/}
      </>
    )) ||
    (error && (
      <div
        style={{
          textAlign: 'center',
          paddingTop: '100px',
          fontSize: '20px',
          color: 'red',
        }}
      >
        {error.toString()}
      </div>
    ))
  )
}

ChartRenderer.propTypes = {
  vizState: PropTypes.object,
  chartConfig: PropTypes.object,
  canEdit: PropTypes.bool,
}

ChartRenderer.defaultProps = {
  vizState: {},
  chartConfig: {},
  canEdit: false,
}

export default ChartRenderer
