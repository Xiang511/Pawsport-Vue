<script setup>
import { ref } from 'vue'

import ComponentCard from '@/components/Tailadmin/common/ComponentCard.vue'
import PageBreadcrumb from '@/components/Tailadmin/common/PageBreadcrumb.vue'
import CheckboxInput from '@/components/Tailadmin/forms/FormElements/CheckboxInput.vue'
import DefaultInputs from '@/components/Tailadmin/forms/FormElements/DefaultInputs.vue'
import Dropzone from '@/components/Tailadmin/forms/FormElements/Dropzone.vue'
import FileInput from '@/components/Tailadmin/forms/FormElements/FileInput.vue'
import InputGroup from '@/components/Tailadmin/forms/FormElements/InputGroup.vue'
import InputState from '@/components/Tailadmin/forms/FormElements/InputState.vue'
import SelectInput from '@/components/Tailadmin/forms/FormElements/SelectInput.vue'
import TextArea from '@/components/Tailadmin/forms/FormElements/TextArea.vue'

const currentPageTitle = ref('Form Elements')
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="space-y-6">
        <ComponentCard title="Default Inputs">
          <DefaultInputs />
        </ComponentCard>
        <ComponentCard title="Select Inputs">
          <SelectInput />
        </ComponentCard>
        <ComponentCard title="Inputs States">
          <TextArea />
        </ComponentCard>
        <ComponentCard title="Inputs States">
          <InputState />
        </ComponentCard>
      </div>
      <div class="space-y-6">
        <ComponentCard title="Inputs Group"><InputGroup /></ComponentCard>
        <ComponentCard title="File Input"><FileInput /></ComponentCard>
        <ComponentCard title="Checkboxes">
          <CheckboxInput />
        </ComponentCard>
        <ComponentCard title="Dropzone">
          <Dropzone />
        </ComponentCard>
      </div>
    </div>
</template>
