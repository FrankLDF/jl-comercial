import 'dayjs/locale/es'

import DatePicker, { type DatePickerProps } from 'antd/lib/date-picker'
import {
  type FunctionComponent,
  type ReactElement,
  type ReactNode,
} from 'react'

import dayjs from 'dayjs'
import localeProp from 'antd/es/date-picker/locale/es_ES'

type disabledWeatherTypes = 'PAST' | 'PRESENT' | 'FUTURE' | null

type CustomDatePickerProps = DatePickerProps & {
  locale?: Record<string, unknown>
  disabledWeather?: disabledWeatherTypes
  disableFrom?: dayjs.Dayjs
  children?: ReactNode
  value?: string | dayjs.Dayjs | null
}

const CustomInputDate: FunctionComponent<CustomDatePickerProps> = ({
  locale = localeProp,
  disabledWeather,
  format = 'DD/MM/YYYY',
  disableFrom,
  value,
  ...props
}): ReactElement => {
  const newProps: any = new Object()

  if (disableFrom) {
    newProps.disabledDate = (current: dayjs.Dayjs) =>
      current && current < dayjs(disableFrom)
  }
  if (disabledWeather === 'PAST') {
    newProps.disabledDate = (current: dayjs.Dayjs) =>
      current && current < dayjs().add(-1, 'days')
  }

  if (disabledWeather === 'PRESENT') {
    newProps.disabledDate = (current: dayjs.Dayjs) => {
      const condition = dayjs(current).format('DD-MM-YYYY')
      const dateDay = dayjs().format('DD-MM-YYYY')

      return current && condition === dateDay
    }
  }

  if (disabledWeather === 'FUTURE') {
    newProps.disabledDate = (current: dayjs.Dayjs) =>
      current && current > dayjs()
  }

  const dateValue = value
    ? typeof value === 'string'
      ? dayjs(value)
      : value
    : null

  return (
    <DatePicker
      style={{ borderRadius: '5px', width: '100%' }}
      format={format}
      locale={locale}
      allowClear
      value={dateValue}
      {...newProps}
      {...props}
    >
      {props.children}
    </DatePicker>
  )
}

export default CustomInputDate
