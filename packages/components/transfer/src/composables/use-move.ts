import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { usePropsAlias } from './use-props-alias'

import type { SetupContext } from 'vue'
import type {
  TransferCheckedState,
  TransferDataItem,
  TransferDirection,
  TransferEmits,
  TransferKey,
  TransferProps,
} from '../transfer'

export const useMove = (
  props: Required<
    Omit<TransferProps, 'filterPlaceholder' | 'filterMethod' | 'renderContent'>
  >,
  checkedState: TransferCheckedState,
  emit: SetupContext<TransferEmits>['emit']
) => {
  const propsAlias = usePropsAlias(props)

  const _emit = (
    value: TransferKey[],
    direction: TransferDirection,
    movedKeys: TransferKey[]
  ) => {
    emit(UPDATE_MODEL_EVENT, value)
    emit(CHANGE_EVENT, value, direction, movedKeys)
  }

  const addToLeft = () => {
    const currentValue = props.modelValue.slice()

    checkedState.rightChecked.forEach((item) => {
      const index = currentValue.indexOf(item)
      if (index > -1) {
        currentValue.splice(index, 1)
      }
    })
    _emit(currentValue, 'left', checkedState.rightChecked)
  }

  const addToRight = () => {
    let currentValue = props.modelValue.slice()

    const itemsToBeMoved = props.data
      .filter((item: TransferDataItem) => {
        const itemKey = item[propsAlias.value.key]
        return (
          checkedState.leftChecked.includes(itemKey) &&
          !props.modelValue.includes(itemKey)
        )
      })
      .map((item) => item[propsAlias.value.key])

    currentValue =
      props.targetOrder === 'unshift'
        ? itemsToBeMoved.concat(currentValue)
        : currentValue.concat(itemsToBeMoved)

    if (props.targetOrder === 'original') {
      currentValue = props.data
        .filter((item) => currentValue.includes(item[propsAlias.value.key]))
        .map((item) => item[propsAlias.value.key])
    }

    _emit(currentValue, 'right', checkedState.leftChecked)
  }

  const moveTargetItem = (
    draggingIndex: number,
    dropIndex: number,
    type: 'before' | 'after'
  ) => {
    const currentValue = props.modelValue.slice()

    const value = (currentValue ?? []).slice()
    const [draggedItem] = value.splice(draggingIndex, 1)
    const step =
      dropIndex > draggingIndex && type === 'before'
        ? -1
        : dropIndex < draggingIndex && type === 'after'
          ? 1
          : 0

    value.splice(dropIndex + step, 0, draggedItem)

    _emit(value, 'right', checkedState.leftChecked)
  }

  return {
    addToLeft,
    addToRight,
    moveTargetItem,
  }
}
