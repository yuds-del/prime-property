<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
    <div class="bg-[#1A1A1A] border border-zinc-700 p-6 rounded-xl w-80 shadow-2xl animate-in fade-in zoom-in duration-200">
      <h3 class="text-white font-bold text-lg mb-2">{{ title }}</h3>
      <p class="text-zinc-400 text-sm mb-6">{{ message }}</p>
      <div class="flex space-x-3">
        <button v-if="isConfirm" @click="$emit('cancel')" class="flex-1 bg-zinc-800 text-white py-2 rounded-lg text-sm hover:bg-zinc-700">Batal</button>
        <button @click="$emit('confirm')" class="flex-1 bg-[#C9A961] text-[#1A1A1A] font-bold py-2 rounded-lg text-sm hover:bg-amber-500">Ya, Lanjut</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'title', 'message', 'isConfirm'])
defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>