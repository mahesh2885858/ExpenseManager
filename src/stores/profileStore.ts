import { create } from 'zustand';
import { TProfile } from '../types';

type TProfileStore = {
  profiles: TProfile[];
  selectedProfileId: TProfile['id'];

  // actions
  setProfiles: (profiles: TProfile[]) => void;
  addProfile: (profile: TProfile) => void;
  setSelectedProfileId: (id: string) => void;
};

const useProfileStore = create<TProfileStore>((set, get) => ({
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
}));

export default useProfileStore;
