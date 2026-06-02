<template>
    <div class="space-y-6">
        <!-- Toast Notification -->
        <NotificationToast 
            :show="toast.show" 
            :message="toast.message" 
            :type="toast.type" 
            @close="toast.show = false" />

        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-white">Manajemen Akun Internal</h1>
            <button @click="showAddModal = true"
                class="bg-[#C9A961] text-[#1A1A1A] px-4 py-2 rounded-lg font-bold text-xs hover:bg-amber-500 transition">
                + Tambah User
            </button>
        </div>

        <div class="bg-[#1A1A1A] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <table class="w-full text-left text-xs">
                <thead class="bg-zinc-900 text-zinc-400 uppercase">
                    <tr>
                        <th class="p-4">Nama Lengkap</th>
                        <th class="p-4">Email</th>
                        <th class="p-4">Role</th>
                        <th class="p-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-zinc-800">
                    <tr v-if="users.length === 0">
                        <td colspan="4" class="p-8 text-center text-zinc-500 italic">Belum ada akun terdaftar.</td>
                    </tr>
                    <tr v-for="user in users" :key="user.id" class="hover:bg-zinc-800/30 transition">
                        <td class="p-4 text-white font-bold">{{ user.nama_lengkap }}</td>
                        <td class="p-4 text-zinc-400">{{ user.email }}</td>
                        <td class="p-4">
                            <span :class="user.role_id === 1 ? 'text-[#C9A961]' : 'text-zinc-400'">
                                {{ user.role_id === 1 ? 'SUPERADMIN' : 'AGENT' }}
                            </span>
                        </td>
                        <td class="p-4 text-center space-x-2">
                            <button @click="toggleRole(user)" class="text-zinc-300 hover:text-white transition">Edit
                                Role</button>
                            <button @click="confirmHapus(user.id)"
                                class="text-[#B33A3A] hover:text-red-400 transition">Hapus</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showAddModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div class="bg-[#1A1A1A] p-6 rounded-xl border border-zinc-700 w-96 space-y-4">
                <h2 class="text-white font-bold">Tambah User Baru</h2>
                <input v-model="newUser.nama_lengkap" placeholder="Nama Lengkap"
                    class="w-full bg-zinc-900 border border-zinc-700 p-2 text-white rounded">
                <input v-model="newUser.email" type="email" placeholder="Email"
                    class="w-full bg-zinc-900 border border-zinc-700 p-2 text-white rounded">
                <input v-model="newUser.password" type="password" placeholder="Password"
                    class="w-full bg-zinc-900 border border-zinc-700 p-2 text-white rounded">
                <select v-model="newUser.role_id" class="w-full bg-zinc-900 border border-zinc-700 p-2 text-white rounded">
                    <option :value="2">Agent</option>
                    <option :value="1">Superadmin</option>
                </select>
                <div class="flex space-x-2 pt-4">
                    <button @click="showAddModal = false"
                        class="flex-1 bg-zinc-700 p-2 rounded text-white">Batal</button>
                    <button @click="tambahUser"
                        class="flex-1 bg-[#C9A961] text-[#1A1A1A] font-bold p-2 rounded">Simpan</button>
                </div>
            </div>
        </div>

        <CustomModal v-model="showModal" :title="modalData.title" :message="modalData.message" :is-confirm="true"
            @confirm="handleConfirm" @cancel="showModal = false" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import CustomModal from '../components/CustomModal.vue'
import NotificationToast from '../components/NotificationToast.vue'

// State
const users = ref([])
const showAddModal = ref(false)
const showModal = ref(false)
const newUser = ref({ nama_lengkap: '', email: '', password: '', role_id: 2 })
const modalData = reactive({ title: '', message: '' })
const selectedUserId = ref(null)
const toast = reactive({ show: false, message: '', type: 'success' })

const getCsrfToken = async () => {
  const res = await fetch('http://localhost:3000/api/auth/csrf-token', { credentials: 'include' });
  const data = await res.json();
  return data.token;
};

const triggerToast = (msg, type = 'success') => {
    toast.message = msg;
    toast.type = type;
    toast.show = true;
    setTimeout(() => { toast.show = false }, 3000);
}

// Fungsi Ambil Data
const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/api/users', { credentials: 'include' })
    users.value = await res.json() // This GET request is less critical, but for consistency, it's good to change
}

onMounted(fetchUsers)

// Fungsi Tambah
const tambahUser = async () => {
    if (!newUser.value.nama_lengkap || !newUser.value.email || !newUser.value.password) {
        return triggerToast('Semua field wajib diisi!', 'error')
    }
    
    const token = await getCsrfToken();
    const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': token },
        credentials: 'include',
        body: JSON.stringify(newUser.value)
    })

    if (res.ok) {
        showAddModal.value = false
        newUser.value = { nama_lengkap: '', email: '', password: '', role_id: 2 }
        fetchUsers()
        triggerToast('User berhasil ditambahkan')
    } else {
        triggerToast('Gagal menambah user', 'error')
    }
}

// Fungsi Edit Role
const toggleRole = async (user) => {
    const newRoleId = user.role_id === 1 ? 2 : 1
    const token = await getCsrfToken();
    const res = await fetch(`http://localhost:3000/api/users/${user.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': token },
        credentials: 'include',
        body: JSON.stringify({ role_id: newRoleId })
    })

    if (res.ok) {
        fetchUsers();
        triggerToast('Role user berhasil diperbarui');
    } else {
        triggerToast('Gagal mengubah role', 'error');
    }
}

// Fungsi Konfirmasi Hapus
const confirmHapus = (id) => {
    selectedUserId.value = id
    modalData.title = 'Hapus Akun'
    modalData.message = 'Yakin ingin menghapus user ini? Tindakan tidak dapat dibatalkan.'
    showModal.value = true
}

const handleConfirm = async () => {
    const token = await getCsrfToken();
    const res = await fetch(`http://localhost:3000/api/users/${selectedUserId.value}`, {
        method: 'DELETE',
        headers: { 'x-csrf-token': token },
        credentials: 'include'
    })
    if (res.ok) {
        fetchUsers();
        triggerToast('Akun berhasil dihapus');
    } else {
        triggerToast('Gagal menghapus akun', 'error');
    }
    showModal.value = false
}
</script>