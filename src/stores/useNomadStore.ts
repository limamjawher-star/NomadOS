import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INITIAL_NOMAD_DATA } from '../data/defaultData';
import {
  NomadState,
  NomadUser,
  NomadCity,
  TripDestination,
  SchengenStay,
  NomadExpense,
  NomadEvent,
  NomadIncomeStream,
  NomadFinancialGoal
} from '../types';

interface NomadStore extends NomadState {
  // Actions
  updateUser: (updated: Partial<NomadUser>) => void;
  upgradePro: (plan: 'yearly' | 'monthly') => void;
  signIn: (userData: Partial<NomadUser>) => void;
  signOut: () => void;
  addCountryVisited: (code: string) => void;
  setCity: (city: string) => void;
  toggleEventRSVP: (eventId: string) => void;
  addEvent: (title: string, date: string, city: string) => void;
  addTrip: (newTrip: TripDestination) => void;
  deleteTrip: (tripId: string) => void;
  addCityToTrip: (city: NomadCity) => void;
  addSchengenStay: (stay: SchengenStay) => void;
  deleteSchengenStay: (id: string) => void;
  addExpense: (expense: NomadExpense) => void;
  deleteExpense: (id: string) => void;
  updateTaxPresence: (id: string, days: number) => void;
  addIncome: (income: NomadIncomeStream) => void;
  deleteIncome: (id: string) => void;
  updateGoal: (goalId: string, addedAmount: number) => void;
  addGoal: (goal: NomadFinancialGoal) => void;
  updateTaxBuffer: (percentage: number) => void;
  updateMonthlyBudget: (budgetUSD: number) => void;
  setHasCompletedOnboarding: (status: boolean) => void;
  setStateData: (data: NomadState) => void;
}

export const useNomadStore = create<NomadStore>()(
  persist(
    (set) => ({
      ...INITIAL_NOMAD_DATA,

      updateUser: (updated) => set((state) => ({
        user: { ...state.user, ...updated }
      })),

      upgradePro: (plan) => set((state) => ({
        user: { ...state.user, isPro: true, subscriptionPlan: plan }
      })),

      signIn: (userData) => set((state) => ({
        user: { ...state.user, ...userData, id: userData.id || state.user.id }
      })),

      signOut: () => set(() => ({
        ...INITIAL_NOMAD_DATA
      })),

      addCountryVisited: (code) => set((state) => ({
        user: {
          ...state.user,
          countriesVisited: state.user.countriesVisited.includes(code)
            ? state.user.countriesVisited
            : [...state.user.countriesVisited, code],
        }
      })),

      setCity: (city) => set({ currentCity: city }),

      toggleEventRSVP: (eventId) => set((state) => ({
        events: state.events.map(ev => 
          ev.id === eventId 
            ? { 
                ...ev, 
                isAttending: !ev.isAttending,
                attendeesCount: ev.isAttending ? ev.attendeesCount - 1 : ev.attendeesCount + 1
              } 
            : ev
        )
      })),

      addEvent: (title, date, city) => set((state) => {
        const newEvent: NomadEvent = {
          id: `ev-${Date.now()}`,
          title,
          city,
          country: 'Portugal', // Need a utility to resolve country from city eventually
          date,
          time: '19:00',
          location: 'Nomad Cafe',
          attendeesCount: 1,
          isAttending: true,
          hostName: state.user.name || 'You',
          hostAvatar: state.user.avatarUrl,
          category: 'Drinks'
        };
        return { events: [newEvent, ...state.events] };
      }),

      addTrip: (newTrip) => set((state) => ({
        trips: [...state.trips, newTrip]
      })),

      deleteTrip: (tripId) => set((state) => ({
        trips: state.trips.filter(t => t.id !== tripId)
      })),

      addCityToTrip: (city) => set((state) => {
        const newTrip: TripDestination = {
          id: `trip-${Date.now()}`,
          city: city.name,
          country: city.country,
          countryCode: city.countryCode,
          arrivalDate: '2026-06-01',
          departureDate: '2026-07-01',
          accommodationStatus: 'Searching',
          housingCostUSD: city.costPerMonthUSD * 0.4,
          visaType: 'Tourist / Visa-free',
          timezone: 'GMT+1',
          coverUrl: city.imageUrl
        };
        return { trips: [...state.trips, newTrip] };
      }),

      addSchengenStay: (stay) => set((state) => ({
        schengenStays: [...state.schengenStays, stay]
      })),

      deleteSchengenStay: (id) => set((state) => ({
        schengenStays: state.schengenStays.filter(s => s.id !== id)
      })),

      addExpense: (expense) => set((state) => ({
        expenses: [expense, ...state.expenses]
      })),

      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),

      updateTaxPresence: (id, days) => set((state) => ({
        taxPresences: state.taxPresences.map(tp => 
          tp.id === id ? { 
            ...tp, 
            daysSpent: days,
            taxResidencyRisk: days > (tp.maxDaysAllowed || 183) ? 'exceeded' : (days > tp.maxSafeDays ? 'high' : 'low') 
          } : tp
        )
      })),

      addIncome: (income) => set((state) => ({
        incomes: [...state.incomes, income]
      })),

      deleteIncome: (id) => set((state) => ({
        incomes: state.incomes.filter(i => i.id !== id)
      })),

      updateGoal: (goalId, addedAmount) => set((state) => ({
        financialGoals: state.financialGoals.map(g => 
          g.id === goalId ? { ...g, currentUSD: Math.min(g.currentUSD + addedAmount, g.targetUSD) } : g
        )
      })),

      addGoal: (goal) => set((state) => ({
        financialGoals: [...state.financialGoals, goal]
      })),

      updateTaxBuffer: (percentage) => set({ taxBufferPercentage: percentage }),

      updateMonthlyBudget: (budgetUSD) => set({ monthlyBudgetUSD: budgetUSD }),

      setHasCompletedOnboarding: (status) => set({ hasCompletedOnboarding: status }),

      setStateData: (data) => set(data),

    }),
    {
      name: 'nomados_state_v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
