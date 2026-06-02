<template>
  <transition name="toast">
    <div v-if="show" 
      class="fixed bottom-6 right-6 z-[100] flex items-center p-4 rounded-xl border shadow-2xl min-w-[300px] backdrop-blur-md"
      :class="type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : 'bg-red-950/90 border-red-500/50 text-red-200'">
      <div class="mr-3">
        <svg v-if="type === 'success'" class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <svg v-else class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-xs font-bold uppercase tracking-wider">{{ type === 'success' ? 'Berhasil' : 'Kesalahan' }}</p>
        <p class="text-sm opacity-90">{{ message }}</p>
      </div>
      <button @click="$emit('close')" class="ml-4 text-white/50 hover:text-white transition">&times;</button>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String,
  type: { type: String, default: 'success' }
})
defineEmits(['close'])
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>