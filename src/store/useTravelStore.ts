import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TravelTrip, TravelSpending, TravelMember, TripStatus, TravelCurrency } from '@/types/travel';

interface TravelState {
  trips: TravelTrip[];
  spendings: TravelSpending[];
  
  // Trips
  addTrip: (trip: Omit<TravelTrip, 'id'>) => void;
  updateTrip: (id: string, trip: Partial<TravelTrip>) => void;
  deleteTrip: (id: string) => void;
  
  // Spendings
  addSpending: (spending: Omit<TravelSpending, 'id'>) => void;
  updateSpending: (id: string, spending: Partial<TravelSpending>) => void;
  deleteSpending: (id: string) => void;
  
  // Mock Data
  initializeMockTravelData: () => void;
}

export const useTravelStore = create<TravelState>()(
  persist(
    (set, get) => ({
      trips: [],
      spendings: [],
      
      addTrip: (trip) => set((state) => ({
        trips: [
          ...state.trips,
          { ...trip, id: `trip-${Math.random().toString(36).substring(2, 9)}` }
        ]
      })),
      
      updateTrip: (id, trip) => set((state) => ({
        trips: state.trips.map((t) => t.id === id ? { ...t, ...trip } : t)
      })),
      
      deleteTrip: (id) => set((state) => ({
        trips: state.trips.filter((t) => t.id !== id),
        spendings: state.spendings.filter((s) => s.tripId !== id)
      })),
      
      addSpending: (spending) => set((state) => ({
        spendings: [
          ...state.spendings,
          { ...spending, id: `spend-${Math.random().toString(36).substring(2, 9)}` }
        ]
      })),
      
      updateSpending: (id, spending) => set((state) => ({
        spendings: state.spendings.map((s) => s.id === id ? { ...s, ...spending } : s)
      })),
      
      deleteSpending: (id) => set((state) => ({
        spendings: state.spendings.filter((s) => s.id !== id)
      })),
      
      initializeMockTravelData: () => {
        const members: TravelMember[] = [
          { id: 'm1', name: '나', color: 'bg-primary' },
          { id: 'm2', name: '친구 A', color: 'bg-orange-400' },
          { id: 'm3', name: '친구 B', color: 'bg-green-400' },
        ];
        
        const osakaTrip: TravelTrip = {
          id: 'trip-osaka',
          name: '오사카 식도락 여행',
          startDate: '2026-03-01',
          endDate: '2026-03-05',
          budget: 1500000,
          baseCurrency: 'KRW',
          emoji: '🇯🇵',
          status: 'active',
          members
        };

        const vietnamTrip: TravelTrip = {
          id: 'trip-vietnam',
          name: '다낭 휴양기',
          startDate: '2026-05-10',
          endDate: '2026-05-14',
          budget: 2000000,
          baseCurrency: 'KRW',
          emoji: '🇻🇳',
          status: 'upcoming',
          members: [members[0], members[2]]
        };
        
        const spendings: TravelSpending[] = [
          {
            id: 's1', tripId: 'trip-osaka', date: '2026-03-01',
            amountKrw: 280000, amountLocal: 280000, localCurrency: 'KRW',
            exchangeRate: 1, payerId: 'm1', category: '항공', memo: '에어서울 RS712',
            splitMemberIds: ['m1', 'm2', 'm3'], isExcludedFromSettlement: false
          },
          {
            id: 's2', tripId: 'trip-osaka', date: '2026-03-01',
            amountKrw: 450000, amountLocal: 450000, localCurrency: 'KRW',
            exchangeRate: 1, payerId: 'm1', category: '숙박', memo: '호텔 닛코 오사카',
            splitMemberIds: ['m1', 'm2', 'm3'], isExcludedFromSettlement: false
          },
          {
            id: 's3', tripId: 'trip-osaka', date: '2026-03-02',
            amountKrw: 12500, amountLocal: 1400, localCurrency: 'JPY',
            exchangeRate: 8.9, payerId: 'm2', category: '식비', memo: '이치란 라면',
            splitMemberIds: ['m1', 'm2', 'm3'], isExcludedFromSettlement: false
          },
          {
            id: 's4', tripId: 'trip-osaka', date: '2026-03-02',
            amountKrw: 156000, amountLocal: 17500, localCurrency: 'JPY',
            exchangeRate: 8.9, payerId: 'm3', category: '쇼핑', memo: '돈키호테 털이',
            splitMemberIds: ['m3'], isExcludedFromSettlement: true
          }
        ];
        
        set({ trips: [osakaTrip, vietnamTrip], spendings });
      }
    }),
    {
      name: 'wealthfolio-travel-storage',
    }
  )
);
