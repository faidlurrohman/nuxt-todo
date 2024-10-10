<script setup lang="ts">
import { format } from "date-fns";

// def variables
const isAddModalOpen = ref(false);
const initialTask = { title: "", date: new Date() };
const taskForm = reactive({ ...initialTask });

const onSubmitTask = async () => {
  await $fetch("/api/post", {
    method: "POST",
    body: {
      title: taskForm.title,
      date: taskForm.date,
    },
  });

  // reset form
  Object.assign(taskForm, initialTask);

  // close modal
  isAddModalOpen.value = false;

  await refreshNuxtData();
};

useHead({
  title: "ToDoList N3",
});
</script>

<template>
  <UContainer class="min-h-screen flex flex-col justify-center py-4">
    <!-- add -->
    <div class="mb-2 text-right">
      <UButton
        icon="i-heroicons-plus"
        size="sm"
        color="black"
        variant="solid"
        label="Add Task"
        :trailing="false"
        @click="isAddModalOpen = true"
      />
    </div>

    <!-- add modal -->
    <UModal v-model="isAddModalOpen" prevent-close>
      <UCard @submit.prevent="onSubmitTask">
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              New Task
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isAddModalOpen = false"
            />
          </div>
        </template>
        <UFormGroup label="Title :" name="title" class="mb-3">
          <UInput v-model="taskForm.title" required placeholder="Title" />
        </UFormGroup>
        <UFormGroup label="Date :" name="date">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              color="black"
              variant="ghost"
              icon="i-heroicons-calendar-days-20-solid"
              :label="format(taskForm.date, 'dd MMM yyy')"
            />

            <template #panel="{ close }">
              <DatePicker v-model="taskForm.date" is-required @close="close" />
            </template>
          </UPopover>
        </UFormGroup>

        <template #footer>
          <UButton type="submit" color="primary"> Save Task </UButton>
        </template>
      </UCard>
    </UModal>

    <!-- page -->
    <NuxtPage />
  </UContainer>
</template>
