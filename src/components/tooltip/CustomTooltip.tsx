import { Tooltip } from 'antd'
import { type TooltipProps } from 'antd/lib/tooltip'

const CustomTooltip: React.FunctionComponent<TooltipProps> = (
  props
): React.ReactElement => <Tooltip {...props}>{props.children}</Tooltip>

export default CustomTooltip
