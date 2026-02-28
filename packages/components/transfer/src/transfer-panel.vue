<template>
  <div ref="wrapperRef" :class="ns.b('panel')">
    <p :class="ns.be('panel', 'header')">
      <el-checkbox
        v-model="allChecked"
        :indeterminate="isIndeterminate"
        :validate-event="false"
        @change="handleAllCheckedChange"
      >
        <span :class="ns.be('panel', 'header-title')">{{ title }}</span>
        <span :class="ns.be('panel', 'header-count')">
          {{ checkedSummary }}
        </span>
      </el-checkbox>
    </p>

    <div
      ref="innerRef"
      :class="[ns.be('panel', 'body'), ns.is('with-footer', hasFooter)]"
    >
      <el-input
        v-if="filterable"
        v-model="query"
        :class="ns.be('panel', 'filter')"
        size="default"
        :placeholder="placeholder"
        :prefix-icon="Search"
        clearable
        :validate-event="false"
      />
      <el-checkbox-group
        v-show="!hasNoMatch && !isEmpty(data)"
        v-model="checked"
        :validate-event="false"
        :class="[ns.is('filterable', filterable), ns.be('panel', 'list')]"
      >
        <el-checkbox
          v-for="(item, index) in filteredData"
          :key="item[propsAlias.key]"
          :class="ns.be('panel', 'item')"
          :value="item[propsAlias.key]"
          :disabled="item[propsAlias.disabled]"
          :draggable="true"
          :validate-event="false"
          @dragstart="(event: DragEvent) => handleDragStart(event, index)"
          @dragover="(event: DragEvent) => handleDragOver(event, index)"
          @dragend="handleDragEnd"
          @drop.stop
        >
          <option-content :option="optionRender?.(item)" />
        </el-checkbox>
      </el-checkbox-group>
      <div
        v-show="hasNoMatch || isEmpty(data)"
        :class="ns.be('panel', 'empty')"
      >
        <slot name="empty">
          {{ hasNoMatch ? t('el.transfer.noMatch') : t('el.transfer.noData') }}
        </slot>
      </div>
    </div>
    <p v-if="hasFooter" :class="ns.be('panel', 'footer')">
      <slot />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, shallowRef, toRefs, useSlots } from 'vue'
import { isEmpty, mutable } from '@element-plus/utils'
import { useLocale, useNamespace } from '@element-plus/hooks'
import { ElCheckbox, ElCheckboxGroup } from '@element-plus/components/checkbox'
import { ElInput } from '@element-plus/components/input'
import { Search } from '@element-plus/icons-vue'
import { MOVE_ITEM_EVENT, transferPanelEmits } from './transfer-panel'
import { useCheck, useDragTag, usePropsAlias } from './composables'

import type { VNode } from 'vue'
import type { TransferPanelProps, TransferPanelState } from './transfer-panel'

defineOptions({
  name: 'ElTransferPanel',
})

const props = withDefaults(defineProps<TransferPanelProps>(), {
  data: () => [],
  format: () => ({}),
  defaultChecked: () => [],
  props: () =>
    mutable({
      label: 'label',
      key: 'key',
      disabled: 'disabled',
    }),
})
const emit = defineEmits(transferPanelEmits)
const slots = useSlots()

const OptionContent = ({ option }: { option?: VNode | VNode[] }) => option

const { t } = useLocale()
const ns = useNamespace('transfer')

const panelState = reactive<TransferPanelState>({
  checked: [],
  allChecked: false,
  query: '',
  checkChangeByUser: true,
})

const propsAlias = usePropsAlias(props)
const {
  filteredData,
  checkedSummary,
  isIndeterminate,
  handleAllCheckedChange,
} = useCheck(props, panelState, emit)

const wrapperRef = shallowRef<HTMLElement>()

const handleDragged = (
  draggingIndex: number,
  dropIndex: number,
  type: 'before' | 'after'
) => {
  emit(MOVE_ITEM_EVENT, draggingIndex, dropIndex, type)

  // const value = (filteredData?.value ?? []).slice()
  // const [draggedItem] = value.splice(draggingIndex, 1)
  // const step =
  //   dropIndex > draggingIndex && type === 'before'
  //     ? -1
  //     : dropIndex < draggingIndex && type === 'after'
  //       ? 1
  //       : 0

  // value.splice(dropIndex + step, 0, draggedItem)
  // console.log(value, props.data)
  // emit(UPDATE_MODEL_EVENT, value)
  // emit(DATA_CHANGE_EVENT, value)
  // emit('drag-tag', draggingIndex, dropIndex + step, draggedItem)
}

const { handleDragStart, handleDragOver, handleDragEnd } = useDragTag({
  wrapperRef,
  handleDragged,
  afterDragged: focus,
})

const hasNoMatch = computed(
  () => !isEmpty(panelState.query) && isEmpty(filteredData.value)
)

const hasFooter = computed(() => !isEmpty(slots.default!()[0].children))

const { checked, allChecked, query } = toRefs(panelState)

defineExpose({
  /** @description filter keyword */
  query,
})
</script>
