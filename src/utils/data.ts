const pad = (number: number) => ('00'+number).slice(-2)

export const get_first_day = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

export const get_last_day = (date: Date) => new Date(date.getFullYear(), date.getMonth()+1, 0)

export const format_query_date = (date: Date = new Date()) => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`

export const format_month  = (date: Date) => new Intl.DateTimeFormat(`default`, {
    month: `long`,
    year: `numeric`,
}).format(date)

export const get_offset_date = (offset: number) => new Date(new Date().setMonth(new Date().getMonth() - offset))
