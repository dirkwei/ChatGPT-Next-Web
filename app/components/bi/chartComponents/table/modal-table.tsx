import React, {useMemo, useState} from 'react'
import {Button, message, Modal, Table} from "antd";
import type {ModalProps, TableProps} from 'antd/es'
// import {axios} from "@yunke/request";
import {useUpdateEffect} from "ahooks";
// import {load1Api} from "@pages/brick/api";
// import {customColumnRender} from "@pages/brick/utils";
import {isEmpty} from 'lodash-es'
// import {genExportData, onExportBasicExcel} from "@components/brick/export-table";
import {customColumnRender} from "@/app/components/bi/utils/utils";
import axios from "axios";
import {genExportData, onExportBasicExcel} from "@/app/components/bi/chartComponents/table/export-table";

interface IProps {
  modalProps: ModalProps
  tableProps?: TableProps<any>
  queries: any[]
  dimensions: string[]
  granularity: string
  start: string
  end: string
  exportFileName?: string
  externalTableData?: any[]
}

const ModalTable: React.FC<IProps> = (props) => {
  const {modalProps, tableProps, queries, dimensions, granularity, start, end, exportFileName, externalTableData} = props

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({current: 1, pageSize: 10})
  const [sort, setSort] = useState([])

  // 格式化query中的start和end参数
  const formatQueries = () => {

    let queriesText = JSON.stringify(queries)
    queriesText = queriesText.replaceAll('{{dateRange1.start}}', start || '')
    queriesText = queriesText.replaceAll('{{dateRange1.end}}', end || '')
    const nextQueries = JSON.parse(queriesText)

    return nextQueries
  }

  const getTableData = (reqQueries: any[]) => {
    const data = {
      "queries": reqQueries,
      "dimensions": dimensions,
    }

    setLoading(true)
    axios.post(load1Api, data, {headers: {app: 'process'}}).then(res => {
      setLoading(false)
      if (res.data.err) {
        message.error(res.data.err)
        return
      }

      const final = res.data.data?.map(item => ({
        ...item,
        annotation: res.data.annotation,
        queries: res.data.queries
      })) || []
      setTableData(final)
    })
  }

  useUpdateEffect(() => {
    if (modalProps.open) {
      if (externalTableData) {
        setTableData(externalTableData)
        return
      }

      const nextQueries = formatQueries()
      getTableData(nextQueries)
    }
  }, [modalProps.open])

  const onTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    setPagination(pagination as any)
  }

  // 导出表格
  const exportWithCustomConfig=(columns: any[], list: any[]) => {
    const result = genExportData(columns, list)
    onExportBasicExcel(columns, result, exportFileName || '新建文件')
  }

  const formattedColumns = useMemo(() => {
    return customColumnRender(tableProps?.columns as any, {
      pagination,
    })
  }, [pagination])

  return <Modal {...modalProps} afterClose={() => setTableData([])} title={'查看全部'}>
    <Table {...tableProps} columns={formattedColumns} dataSource={tableData}
           loading={loading} onChange={onTableChange}/>
    <Button onClick={() => exportWithCustomConfig(tableProps?.columns || [], tableData)} disabled={isEmpty(tableData)}>导出</Button>
  </Modal>
}

export default ModalTable
