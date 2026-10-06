// src/store/gameStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGameStore = create(
  persist(
    (set, get) => ({
      // === CORE PLAYER STATS ===
      money: 90000, // Default Lapo spawn amount
      respect: 10,
      energy: 80,
      sanity: 75,
      heat: 0, // EFCC/Police attention level (0-100)
      
      // === CHARACTER IDENTITY ===
      gender: null, // 'male' | 'female'
      root: null,   // 'ijebu' | 'egba' | 'remo'
      classType: null, // 'lapo' | 'nepo'
      isIJGB: false, // Nepo sub-trait
      
      // === LOCATION & PROGRESSION ===
      currentLocation: 'sango', // Default Lapo spawn
      homeLocation: null,       // Player's owned/rented property
      visitedLocations: [],     // Tracks explored areas
      
      // === INVENTORY & ASSETS ===
      inventory: [],            // Items like 'laptop', 'ringlight', 'generator'
      clothing: [],             // Owned outfits (e.g., 'yrn-hoodie')
      vehicles: [],             // Owned transport ('keke', 'okada', 'car')
      
      // === SOCIAL & SPIRITUAL ===
      friends: [],              // List of player usernames
      babaTasks: [],            // Active spiritual quests
      hasAsejeCurse: false,     // Spiritual confiscation active
      hasSoapShame: false,      // Spiritual nakedness active
      
      // === ACTIONS ===
      
      // Update multiple stats at once (for travel, events, etc.)
      updateStats: (changes) => set((state) => {
        const newStats = { ...state };
        Object.entries(changes).forEach(([key, value]) => {
          if (newStats[key] !== undefined) {
            // Clamp values between min/max where applicable
            if (['respect', 'energy', 'sanity', 'heat'].includes(key)) {
              newStats[key] = Math.max(0, Math.min(100, newStats[key] + value));
            } else if (key === 'money') {
              newStats[key] = Math.max(0, newStats[key] + value);
            } else {
              newStats[key] = value;
            }
          }
        });
        return newStats;
      }),
      
      // Travel to a new location (deducts energy/money based on transport)
      travelTo: (locationId, transportCost, energyCost) => set((state) => ({
        currentLocation: locationId,
        energy: Math.max(0, state.energy - energyCost),
        money: Math.max(0, state.money - transportCost),
        visitedLocations: state.visitedLocations.includes(locationId) 
          ? state.visitedLocations 
          : [...state.visitedLocations, locationId],
      })),
      
      // Add item to inventory
      addItem: (item) => set((state) => ({
        inventory: [...state.inventory, item],
      })),
      
      // Remove item from inventory
      removeItem: (itemName) => set((state) => ({
        inventory: state.inventory.filter(i => i.name !== itemName),
      })),
      
      // Buy clothing
      buyClothing: (clothingItem) => set((state) => ({
        clothing: [...state.clothing, clothingItem],
        money: state.money - clothingItem.price,
      })),
      
      // Set home location (after renting/buying property)
      setHome: (locationId) => set({ homeLocation: locationId }),
      
      // Add friend by username
      addFriend: (username) => set((state) => ({
        friends: state.friends.includes(username) 
          ? state.friends 
          : [...state.friends, username],
      })),
      
      // Accept Baba task
      acceptBabaTask: (task) => set((state) => ({
        babaTasks: [...state.babaTasks, { ...task, acceptedAt: Date.now() }],
      })),
      
      // Complete Baba task
      completeBabaTask: (taskId) => set((state) => ({
        babaTasks: state.babaTasks.filter(t => t.id !== taskId),
      })),
      
      // Trigger spiritual consequences
      triggerAseje: () => set({ hasAsejeCurse: true }),
      clearAseje: () => set({ hasAsejeCurse: false }),
      triggerSoap: () => set({ hasSoapShame: true }),
      clearSoap: () => set({ hasSoapShame: false }),
      
      // Reset game (for testing/new character)
      resetCharacter: () => set({
        money: 90000,
        respect: 10,
        energy: 80,
        sanity: 75,
        heat: 0,
        gender: null,
        root: null,
        classType: null,
        isIJGB: false,
        currentLocation: 'sango',
        homeLocation: null,
        visitedLocations: [],
        inventory: [],
        clothing: [],
        vehicles: [],
        friends: [],
        babaTasks: [],
        hasAsejeCurse: false,
        hasSoapShame: false,
      }),
    }),
    {
      name: 'gateway-life-save', // LocalStorage key
      partialize: (state) => ({
        // Only persist these fields (exclude transient UI state)
        money: state.money,
        respect: state.respect,
        energy: state.energy,
        sanity: state.sanity,
        heat: state.heat,
        gender: state.gender,
        root: state.root,
        classType: state.classType,
        isIJGB: state.isIJGB,
        currentLocation: state.currentLocation,
        homeLocation: state.homeLocation,
        visitedLocations: state.visitedLocations,
        inventory: state.inventory,
        clothing: state.clothing,
        vehicles: state.vehicles,
        friends: state.friends,
        babaTasks: state.babaTasks,
        hasAsejeCurse: state.hasAsejeCurse,
        hasSoapShame: state.hasSoapShame,
      }),
    }
  )
);
