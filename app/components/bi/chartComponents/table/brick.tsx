import React, {useMemo, useState} from 'react';
import {Button, Select, Space, Table, DatePicker, message} from 'antd';
import type {ColumnsType, TableProps} from 'antd/es/table';
// import {DateFormat, Granularity, GranularityOptions} from "@pages/brick/common";
// import {axios} from "@yunke/request";
import {useMount, useUpdateEffect} from "ahooks";
import dayjs from 'dayjs'
// import ModalTable from "@pages/brick/modal-table";
// import {load1Api} from "@pages/brick/api";
import './brick.scss'
import {customColumnRender} from "@/app/components/bi/utils/utils";
import {ResultRoot} from "@/app/components/bi/types";
import ModalTable from "@/app/components/bi/chartComponents/table/modal-table";

const {RangePicker} = DatePicker;

interface IProps {
  // queries: any[]
  // dimensions: string[]
  columns: ColumnsType<any>[]
  // dateConfig: {
  //   granularity: string
  //   pickerType: string
  //   start: string
  //   end: string
  // }
  // title: string
  resultSet: ResultRoot
}

const Brick: React.FC<IProps> = (props) => {
  const {title, dateConfig, columns, queries, dimensions, resultSet} = props
  // const [granularity, setGranularity] = useState(dateConfig?.granularity || 'month')
  // const [start, setStart] = useState(dateConfig?.start)
  // const [end, setEnd] = useState(dateConfig?.end)
  const [showAll, setShowAll] = useState(false)
  // const [order, setOrder] = useState([])

  const formatData = (resp: ResultRoot) => {
    const {data, queries, annotation} = resp

    return data?.map(item => ({
      ...item,
      annotation,
      queries
    })) || []
  }
  const [tableData, setTableData] = useState(formatData(resultSet))
  // const [loading, setLoading] = useState(false)

  // const onDateChange = (date?: dayjs[]) => {
  //   if (!Array.isArray(date) || date.length === 0) {
  //     setStart('')
  //     setEnd('')
  //     return;
  //   }
  //
  //   updateDateRange(date)
  // };

  // const updateDateRange = (date: dayjs[]) => {
  //   const formattedDateString = [date[0].startOf(granularity).format(DateFormat), date[1].endOf(granularity).format(DateFormat)];
  //   setStart(formattedDateString[0]);
  //   setEnd(formattedDateString[1]);
  // }

  // 格式化query中的start和end参数
  // const formatQueries = () => {
  //
  //   let queriesText = JSON.stringify(queries)
  //   queriesText = queriesText.replaceAll('{{dateRange1.start}}', start || '')
  //   queriesText = queriesText.replaceAll('{{dateRange1.end}}', end || '')
  //   const nextQueries = JSON.parse(queriesText)
  //
  //   return nextQueries
  // }

  // const getTableData = (reqQueries: any[]) => {
  //
  //   const data = {
  //     "queries": reqQueries,
  //     "dimensions": dimensions,
  //     "order": {}
  //   }
  //
  //   if (order.length > 0 && !!order[1]) {
  //     const orderKeyName = order[0]
  //     data.order = {
  //       [orderKeyName]: order[1] === 'ascend' ? 'asc' : 'desc'
  //     }
  //   }
  //
  //   setLoading(true)
  //   axios.post(load1Api, data, {headers: {app: 'process'}}).then(res => {
  //     setLoading(false)
  //     if (res.data.err) {
  //       message.error(res.data.err)
  //       return
  //     }
  //
  //     const final = res.data.data?.map(item => ({
  //       ...item,
  //       annotation: res.data.annotation,
  //       queries: res.data.queries
  //     })) || []
  //     setTableData(final)
  //   })
  // }

  // useMount(() => {
  //   const nextQueries = formatQueries()
  //   getTableData(nextQueries)
  // })

  // 日期变化
  // useUpdateEffect(() => {
  //   const nextQueries = formatQueries()
  //   getTableData(nextQueries)
  // }, [start, end])

  // 字段排序变化
  // const onTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  //   if (order.columnKey === sorter.columnKey && order.order === sorter.order) {
  //     return
  //   }
  //
  //   setOrder([sorter.columnKey, sorter.order])
  // }

  // useUpdateEffect(() => {
  //   const nextQueries = formatQueries()
  //   getTableData(nextQueries)
  // }, [order])

  // const startDay = dayjs(start, DateFormat);
  // const endDay = dayjs(end, DateFormat);

  // useUpdateEffect(() => {
  //   if (granularity === Granularity.DATE) {
  //     const today = dayjs()
  //     updateDateRange([today, today])
  //     return;
  //   }
  //
  //   if (dateConfig.pickerType === 'range') {
  //     updateDateRange([startDay, endDay])
  //     return
  //   }
  //
  //   // 单值控件重新计算时间
  //   // 日期粒度需要start和end相同
  //   updateDateRange([dayjs(end, DateFormat), dayjs(end, DateFormat)])
  // }, [granularity])

  const formattedColumns = useMemo(() => {
    return customColumnRender(columns, {
      pagination: {current: 1, pageSize: 10},
    })
  }, [])

  return <div style={{backgroundColor: '#fff'}}>
    {/*<div style={{padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>*/}
    {/*  <div>{title}</div>*/}
    {/*  <div>*/}
    {/*    <Space>*/}
    {/*      <Select options={GranularityOptions} value={granularity} onChange={setGranularity}/>*/}
    {/*      {*/}
    {/*        dateConfig.pickerType === 'range' ?*/}
    {/*          // 日期范围组件*/}
    {/*          <RangePicker picker={granularity} onChange={onDateChange}*/}
    {/*                       value={[startDay.isValid() ? startDay : null, endDay.isValid() ? endDay : null]}*/}
    {/*                       style={{width: 220}} allowClear={false}/> :*/}
    {/*          // 日期选择组件*/}
    {/*          <DatePicker picker={granularity} onChange={(date) => onDateChange([date, date])}*/}
    {/*                      value={endDay.isValid() ? endDay : null}*/}
    {/*                      style={{width: 220}} allowClear={false}/>*/}
    {/*      }*/}
    {/*      <Button onClick={() => setShowAll(true)}>查看全部</Button>*/}
    {/*    </Space>*/}
    {/*  </div>*/}
    {/*</div>*/}
    <Table columns={formattedColumns} dataSource={tableData}
           pagination={{pageSize: 5}} size={'small'} style={{height: 284, overflowY: 'auto'}}
           className="no-pagination"/>
    <Button onClick={() => setShowAll(true)} >查看全部</Button>
    <ModalTable
      modalProps={{
        open: showAll,
        onCancel: () => setShowAll(false), footer: false,
        width: '80%'
      }}
      tableProps={{columns: columns as any, size: 'small'}}
      exportFileName={"新建表格"}
      externalTableData={tableData}
    />
  </div>
}

export default Brick


