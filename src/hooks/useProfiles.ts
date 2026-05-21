import { useEffect, useMemo } from 'react';
import { profileRepository } from '../db/repositories/profiles.repo';
import useProfileStore from '../stores/profileStore';
import { TProfile } from '../types';
import { generateRecordId, getCurrentUTCTimeStamp } from '../utils';

const useProfiles = () => {
  const addProfile = useProfileStore(state => state.addProfile);
  const profiles = useProfileStore(state => state.profiles);
  const selectedProfileId = useProfileStore(state => state.selectedProfileId);

  const createProfile = async (profileName: string) => {
    const profile: TProfile = {
      name: profileName,
      id: generateRecordId(),
      createdAt: getCurrentUTCTimeStamp(),
    };
    const profileCreateResults = await profileRepository.create(profile);
    console.log({ t: profileCreateResults });
    addProfile(profile);
    return profile;
  };

  const selectedProfile = useMemo(() => {
    return profiles.find(p => p.id === selectedProfileId);
  }, [profiles, selectedProfileId]);

  return {
    createProfile,
    profiles,
    selectedProfile,
  };
};

export default useProfiles;
