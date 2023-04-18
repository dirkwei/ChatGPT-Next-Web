export interface ResultRoot {
  queries: Query[]
  data: Dartium[]
  annotation: Annotation
}

export interface Query {
  measures: string[]
  filters: Filter[]
  dimensions: string[]
  order: Order
}

export interface Filter {
  member: string
  operator: string
  values: string[]
}

export interface Order {}

export interface Dartium {
  [key: string]: any
}

export interface Annotation {
  dimensions: Dimensions
  timeDimensions: TimeDimensions
  measures: Measures
}

export interface Dimensions {
  [key: string]: DimensionItem
}

export interface DimensionItem {
  title: string
  shortTitle: string
  type: string
}

export interface TimeDimensions {
  granularity: string
  dimension: string
  dateRange: string[]
}

export interface Measures {
  [key: string]: MeasureItem
}

export interface MeasureItem {
  title: string
  shortTitle: string
  type: string
  drillMembers: string[]
  drillMembersGrouped: DrillMembersGrouped
}

export interface DrillMembersGrouped {
  measures: any[]
  dimensions: string[]
}
