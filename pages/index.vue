<script setup lang="ts">
import { format } from "date-fns";

// def variables
const isDeleteModalOpen = ref(false);
const idTask = ref("");
const isLoading = ref(false);

// tabs
const items = [
  {
    slot: "today",
    label: "Today",
  },
  {
    slot: "incoming",
    label: "Incoming",
  },
];

// get data today
const { data: tasks, refresh: refreshToday } = useFetch(() => "/api", {
  key: "tasks",
});

// get data incoming
const { data: incomingTasks, refresh: refreshIncoming } = useFetch(
  () => "/api/incoming",
  {
    key: "incomingTasks",
  }
);

// do complete or uncomplete
const handleUpdateTask = async (id: string, value: boolean) => {
  await $fetch(`/api/update/${id}`, {
    method: "PATCH",
    body: {
      isCompleted: !value,
    },
  }).finally(() => {
    refreshToday();
    refreshIncoming();
  });
};

// prepare for delete
const handleDeleteTask = async (id: string) => {
  idTask.value = id;
  isDeleteModalOpen.value = true;
};

// do delete task
const doDeleteTask = async () => {
  isLoading.value = true;

  await $fetch(`/api/delete/${idTask.value}`, { method: "DELETE" }).finally(
    () => {
      // reset variable
      isLoading.value = false;
      idTask.value = "";
      isDeleteModalOpen.value = false;

      refreshToday();
      refreshIncoming();
    }
  );
};
</script>

<template>
  <UTabs :items="items">
    <template #today="{ item }">
      <div v-if="tasks?.length === 0" class="flex flex-col items-center w-full">
        <p>There is no task for today.</p>
      </div>
      <div v-for="task in tasks" :key="task.id">
        <UCard
          class="mb-2"
          :ui="{
            background: `${
              task.isCompleted ? 'bg-lime-500' : 'bg-white'
            } 'dark:bg-gray-900'`,
          }"
        >
          <div class="flex justify-between items-center pb-3">
            <div class="flex-1">
              <p
                :class="`text-xs font-light leading-6 ${
                  task.isCompleted ? 'text-white' : 'text-gray-900'
                } dark:text-white`"
              >
                {{ format(new Date(task.date), "dd MMM yyy") }}
              </p>
            </div>
            <div>
              <UButton
                size="xs"
                type="submit"
                :color="`${task.isCompleted ? 'amber' : 'emerald'}`"
                class="mx-2"
                icon="i-heroicons-check"
                :trailing="false"
                v-on:click="() => handleUpdateTask(task.id, task.isCompleted)"
              >
                {{ task.isCompleted ? "Uncompleted" : "Completed" }}
              </UButton>
              <UButton
                size="xs"
                type="submit"
                color="rose"
                icon="i-heroicons-trash"
                :trailing="false"
                v-on:click="() => handleDeleteTask(task.id)"
              >
                Delete
              </UButton>
            </div>
          </div>
          <p
            :class="`text-sm leading-6 ${
              task.isCompleted ? 'line-through text-white' : 'text-gray-900'
            } dark:text-white`"
          >
            {{ task.title }}
          </p>
        </UCard>
      </div>
    </template>

    <template #incoming="{ item }">
      <div
        v-if="incomingTasks?.length === 0"
        class="flex flex-col items-center w-full"
      >
        <p>There is no task.</p>
      </div>
      <div v-for="incoming in incomingTasks" :key="incoming.id">
        <UCard
          class="mb-2"
          :ui="{
            background: `${
              incoming.isCompleted ? 'bg-lime-500' : 'bg-white'
            } 'dark:bg-gray-900'`,
          }"
        >
          <div class="flex justify-between items-center pb-3">
            <div class="flex-1">
              <p
                :class="`text-xs font-light leading-6 ${
                  incoming.isCompleted ? 'text-white' : 'text-gray-900'
                } dark:text-white`"
              >
                {{ format(new Date(incoming.date), "dd MMM yyy") }}
              </p>
            </div>
            <div>
              <UButton
                size="xs"
                type="submit"
                :color="`${incoming.isCompleted ? 'orange' : 'emerald'}`"
                class="mx-2"
                icon="i-heroicons-check"
                :trailing="false"
                v-on:click="
                  () => handleUpdateTask(incoming.id, incoming.isCompleted)
                "
              >
                {{ incoming.isCompleted ? "Uncompleted" : "Completed" }}
              </UButton>
              <UButton
                size="xs"
                type="submit"
                color="rose"
                icon="i-heroicons-trash"
                :trailing="false"
                v-on:click="() => handleDeleteTask(incoming.id)"
              >
                Delete
              </UButton>
            </div>
          </div>
          <p
            :class="`text-sm leading-6 ${
              incoming.isCompleted ? 'line-through text-white' : 'text-gray-900'
            } text-gray-900 dark:text-white`"
          >
            {{ incoming.title }}
          </p>
        </UCard>
      </div>
    </template>
  </UTabs>

  <!-- delete modal -->
  <UModal
    v-model="isDeleteModalOpen"
    :ui="{ width: 'w-full sm:max-w-xs' }"
    prevent-close
  >
    <UCard>
      <template #header>
        <p
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white text-center"
        >
          Are you sure ?
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center">
          You won't be able to revert this !
        </p>
      </template>
      <!-- <p class="text-sm leading-6 text-gray-900 dark:text-white">
        Are you sure to delete task ?
      </p> -->
      <template #footer>
        <div class="flex justify-center align-middle">
          <UButton
            type="submit"
            color="primary"
            class="mr-2"
            v-on:click="() => doDeleteTask()"
            :loading="isLoading"
          >
            Yes, continue!
          </UButton>
          <UButton
            type="submit"
            color="rose"
            @click="isDeleteModalOpen = false"
          >
            Cancel
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
