import { ref } from 'vue'

const properties = ref([
  { 
    id: 1, 
    title: 'Grand Luxury Mansion', 
    price: 4500000000, 
    location: 'Menteng, Jakarta Pusat', 
    type: 'Rumah', 
    status: 'Urgent',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 2, 
    title: 'Skyline Penthouse Suites', 
    price: 2100000000, 
    location: 'SCBD, Jakarta Selatan', 
    type: 'Apartemen', 
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 3, 
    title: 'Ruko Modern Golden Boulevard', 
    price: 1750000000, 
    location: 'BSD City, Tangerang', 
    type: 'Ruko', 
    status: 'Terjual',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  }
])

export function useProperties() {
  return {
    properties
  }
}