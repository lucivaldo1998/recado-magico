import { create } from 'zustand'

export const useStore = create((set, get) => ({
  packages: [],
  characters: [],
  setPackages: (packages) => set({ packages }),
  setCharacters: (characters) => set({ characters }),

  // Purchase flow
  selectedPackage: null,
  selectedCharacters: [],
  customerName: '',
  customerEmail: '',
  childName: '',
  childAge: '',
  whatsapp: '',
  notes: '',
  occasion: 'birthday',

  selectPackage: (pkg) => set({ selectedPackage: pkg, selectedCharacters: [] }),
  toggleCharacter: (char) => {
    const { selectedCharacters, selectedPackage } = get()
    const exists = selectedCharacters.find((c) => c.id === char.id)
    if (exists) {
      set({ selectedCharacters: selectedCharacters.filter((c) => c.id !== char.id) })
    } else if (selectedPackage && selectedCharacters.length < selectedPackage.characters_count) {
      set({ selectedCharacters: [...selectedCharacters, char] })
    }
  },
  removeCharacter: (id) => {
    set({ selectedCharacters: get().selectedCharacters.filter((c) => c.id !== id) })
  },
  setCustomerName: (customerName) => set({ customerName }),
  setCustomerEmail: (customerEmail) => set({ customerEmail }),
  setChildName: (childName) => set({ childName }),
  setChildAge: (childAge) => set({ childAge }),
  setWhatsapp: (whatsapp) => set({ whatsapp }),
  setNotes: (notes) => set({ notes }),
  setOccasion: (occasion) => set({ occasion }),

  hasSelectedAllCharacters: () => {
    const { selectedPackage, selectedCharacters } = get()
    return selectedPackage && selectedCharacters.length === selectedPackage.characters_count
  },

  calculateTotal: () => {
    const { selectedPackage } = get()
    if (!selectedPackage) return 0
    return selectedPackage.price
  },

  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),

  resetPurchase: () =>
    set({
      selectedPackage: null,
      selectedCharacters: [],
      customerName: '',
      customerEmail: '',
      childName: '',
      childAge: '',
      whatsapp: '',
      notes: '',
      occasion: 'birthday',
      currentOrder: null,
    }),
}))
