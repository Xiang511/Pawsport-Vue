<script setup>
import { SuccessIcon, ErrorIcon, WarningIcon, InfoCircleIcon } from '@/components/Tailadmin/icons'

const props = defineProps({
  variant: {
    type: String,
    required: true,
    // 雖然沒有 TS 強制檢查，但可以用 validator 確保值正確
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  showLink: {
    type: Boolean,
    default: false,
  },
  linkHref: {
    type: String,
    default: '#',
  },
  linkText: {
    type: String,
    default: 'Learn more',
  },
})

// 樣式對照表
const variantClasses = {
  success: {
    container: 'border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15',
    icon: 'text-success-500',
  },
  error: {
    container: 'border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15',
    icon: 'text-error-500',
  },
  warning: {
    container: 'border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15',
    icon: 'text-warning-500',
  },
  info: {
    container:
      'border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15',
    icon: 'text-blue-light-500',
  },
}

// 圖示對照表
const icons = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoCircleIcon,
}
</script>
<template>
  <div :class="['rounded-xl border p-4', variantClasses[variant].container]">
    <div class="flex items-start gap-3">
      <div :class="['-mt-0.5', variantClasses[variant].icon]">
        <component :is="icons[variant]" />
      </div>

      <div>
        <h4 class="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
          {{ title }}
        </h4>

        <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>

        <router-link
          v-if="showLink"
          :to="linkHref"
          class="mt-3 inline-block text-sm font-medium text-gray-500 underline dark:text-gray-400">
          {{ linkText }}
        </router-link>
      </div>
    </div>
  </div>
</template>
