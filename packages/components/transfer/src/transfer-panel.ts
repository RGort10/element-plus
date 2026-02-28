import { buildProps, definePropType } from '@element-plus/utils'
import { transferCheckedChangeFn, transferProps } from './transfer'
import { isArray, isNumber } from 'lodash-unified'

import type { ExtractPublicPropTypes, VNode } from 'vue'
import type { TransferDataItem, TransferKey, TransferProps } from './transfer'
import type TransferPanel from './transfer-panel.vue'

export interface TransferPanelState {
  checked: TransferKey[]
  allChecked: boolean
  query: string
  checkChangeByUser: boolean
}

export const CHECKED_CHANGE_EVENT = 'checked-change'
export const DATA_CHANGE_EVENT = 'update:data'
export const MOVE_ITEM_EVENT = 'move-item'

export interface TransferPanelProps {
  data?: TransferProps['data']
  optionRender?: (option: TransferDataItem) => VNode | VNode[]
  placeholder?: string
  title?: string
  filterable?: boolean
  format?: TransferProps['format']
  filterMethod?: TransferProps['filterMethod']
  defaultChecked?: TransferProps['leftDefaultChecked']
  props?: TransferProps['props']
}

/**
 * @deprecated Removed after 3.0.0, Use `TransferPanelProps` instead.
 */
export const transferPanelProps = buildProps({
  data: transferProps.data,
  optionRender: {
    type: definePropType<(option: TransferDataItem) => VNode | VNode[]>(
      Function
    ),
  },
  placeholder: String,
  title: String,
  filterable: Boolean,
  format: transferProps.format,
  filterMethod: transferProps.filterMethod,
  defaultChecked: transferProps.leftDefaultChecked,
  props: transferProps.props,
} as const)

/**
 * @deprecated Removed after 3.0.0, Use `TransferPanelProps` instead.
 */
export type TransferPanelPropsPublic = ExtractPublicPropTypes<
  typeof transferPanelProps
>

export const transferPanelEmits = {
  [CHECKED_CHANGE_EVENT]: transferCheckedChangeFn,
  [DATA_CHANGE_EVENT]: (value: TransferDataItem[]) => isArray(value),
  [MOVE_ITEM_EVENT]: (
    draggingIndex: number,
    dropIndex: number,
    type: 'before' | 'after'
  ) =>
    isNumber(draggingIndex) &&
    isNumber(dropIndex) &&
    ['before', 'after'].includes(type),
}
export type TransferPanelEmits = typeof transferPanelEmits

export type TransferPanelInstance = InstanceType<typeof TransferPanel> & unknown
