import { create } from 'zustand';
import { TProfile } from '../types';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import zustandStorage from '../storage';

type TProfileStore = {
  profiles: TProfile[];
  selectedProfileId: TProfile['id'];

  // actions
  setProfiles: (profiles: TProfile[]) => void;
  addProfile: (profile: TProfile) => void;
  setSelectedProfileId: (id: TProfile['id']) => void;
};

const useProfileStore = create<TProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      selectedProfileId: '',
      setProfiles: profiles => {
        set({ profiles });
      },
      addProfile(profile) {
        set({ profiles: [...get().profiles, profile] });
      },
      setSelectedProfileId(id) {
        set({ selectedProfileId: id });
      },
    }),
    {
      name: 'Profile-stroage',
      storage: createJSONStorage(zustandStorage),
      partialize: state => ({ selectedProfileId: state.selectedProfileId }),
    },
  ),
);

export default useProfileStore;
