import {ResultRoot} from "@/app/components/bi/types";

enum ChartTypes {
  Number = 'number',
  Pie = 'pie',
  Bar = 'bar',
  Line = 'line',
  Table = 'table',
}

// a function that return one ChartType
// param: ResultRoot
// if param.annotation.measures has only one key, and param.data has only one item, return ChartTypes.Number
// if param.annotation.timeDimensions has no key, and param.annotation.measures has only one key, and param.data has less than 10 return ChartTypes.Pie
// if param.annotation.timeDimensions has no key, and param.annotation.measures has only one key, and param.data has more than 10 return ChartTypes.Bar
// if param.annotation.timeDimensions has key, and param.annotation.measures has only one key, return ChartTypes.Line
// other conditions return ChartTypes.Table
export function autoChartType(result: ResultRoot): ChartTypes {
  const {annotation, data} = result
  const {measures, timeDimensions} = annotation
  const measureKeys = Object.keys(measures)
  if (measureKeys.length === 1 && data.length === 1) {
    return ChartTypes.Number
  }

  const timeDimensionsLength = Object.keys(timeDimensions).length
  if (timeDimensionsLength === 0 && measureKeys.length === 1 && data.length < 10) {
    return ChartTypes.Pie
  }
  if (timeDimensionsLength === 0 && measureKeys.length === 1 && data.length >= 10) {
    return ChartTypes.Bar
  }
  if (timeDimensionsLength !== 0 && measureKeys.length === 1) {
    return ChartTypes.Line
  }

  return ChartTypes.Table
}
