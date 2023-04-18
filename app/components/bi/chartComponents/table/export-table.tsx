import * as ExcelJs from 'exceljs';
import {difference} from 'lodash-es'
import {generateHeaders, saveWorkbook} from "@/app/components/bi/chartComponents/export-utils";

export function onExportBasicExcel(columns: any[], dataSource: any[], fileName: string) {
  // 创建工作簿
  const workbook = new ExcelJs.Workbook();
  // 添加sheet
  const worksheet = workbook.addWorksheet('sheet1');
  // 设置 sheet 的默认行高
  worksheet.properties.defaultRowHeight = 20;
  // 设置列
  worksheet.columns = generateHeaders(columns);
  // 添加行
  worksheet.addRows(dataSource);
  // 导出excel
  saveWorkbook(workbook, `${fileName}.xlsx`);
}

export function genExportData (columns: any[], dataSource: any[]) {
  // 讲列配置数组调整为map
  const columnKeyMapping = {}
  const columnConfigKeys: string[] = []
  columns.map(columnItem => {
    columnConfigKeys.push(columnItem.key)
    columnKeyMapping[columnItem.key] = columnItem
  })


  const formattedDataSource: any[] = []
  dataSource.map((record: Record<string, any>, recordIndex: number) => {
    const newDataItem = {}
    // 数据中存在的key
    const existedKeys = Object.keys(record)

    existedKeys.map((recordKey: string) => {
      const columnConfig = columnKeyMapping[recordKey]

      if (!columnConfig) {
        return
      }

      // 在Excel文件中展示的内容
      if (columnConfig.exportRender) {
        newDataItem[recordKey] = columnConfig.exportRender(record[recordKey], record, recordIndex)
        return
      }

      newDataItem[recordKey] = record[recordKey]
    })

    // 存在列配置，但record字段不存在的场景
    const differentKeys = difference(columnConfigKeys, existedKeys)
    differentKeys.map((key: string) => {
      if (columnKeyMapping[key].exportRender) {
        newDataItem[key] = columnKeyMapping[key].exportRender(undefined, record, recordIndex)
      }
    })

  //   保存配置
    formattedDataSource.push(newDataItem)
  })

  return formattedDataSource
}
