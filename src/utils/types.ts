export type APOD = {
  title: string
  date: string
  url: string
  hdurl: string
  copyright: string
  explanation: string
}

export type QueryArguments = {
  signal: AbortSignal
  first_day: Date
  max_day: Date
  offset: number
}

export type DateRangeArguments = {
  length: number
  starting_index: number
  date: Date
  style?: (i: number, date: Date) => string
  loading?: boolean
}