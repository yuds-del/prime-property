<template>
  <div class="filter-panel bg-white p-4 shadow rounded mb-4">
    <h3 class="font-bold mb-2">Filter Properti</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input 
        v-model="filters.search" 
        placeholder="Cari nama, grup, atau kawasan..." 
        class="border p-2 rounded w-full"
      />
      
      <select v-model="filters.kawasan" class="border p-2 rounded">
        <option value="">Semua Kawasan</option>
        <option v-for="k in options.kawasan" :key="k" :value="k">{{ k }}</option>
      </select>

      <input 
        type="number" 
        v-model="filters.priceMax" 
        placeholder="Harga Maksimal (Rp)" 
        class="border p-2 rounded"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps(['kawasanOptions']);
const emit = defineEmits(['update:filters']);

const route = useRoute();
const router = useRouter();

const filters = reactive({
  search: route.query.search || '',
  kawasan: route.query.kawasan || '',
  priceMax: route.query.priceMax || ''
});

const options = {
  kawasan: props.kawasanOptions || ['Krakatau', 'Pancing', 'Cemara Asri', 'Helvetia']
};

// Watch perubahan filter dan update URL + Emit
watch(filters, (newFilters) => {
  router.replace({ query: { ...newFilters } });
  emit('update:filters', newFilters);
}, { deep: true });

onMounted(() => {
    emit('update:filters', filters);
});
</script>
