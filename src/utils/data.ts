const pad = (number: number): string => ('00'+number).slice(-2)

export const query = async (input: string): Promise<any> => { 

    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=hIZ20K4ftBKwN1AdggqcZxrIjiquLTRkQlhO611D${input}`)

    return res.json()

}

export const get_first_day = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1)

export const get_last_day = (date: Date): Date => new Date(date.getFullYear(), date.getMonth()+1, 0)

export const format_query_date = (date: Date = new Date()): string => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`

export const format_month  = (date: Date): string => new Intl.DateTimeFormat(`default`, {
    month: `long`,
    year: `numeric`,
}).format(date)

export const get_offset_date = (offset: number): Date => new Date(new Date().setMonth(new Date().getMonth() - offset))
