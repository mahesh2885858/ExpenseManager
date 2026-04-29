import { useEffect } from 'react';
import { profileRepository } from '../db/repositories/profiles.repo';
import useProfileStore from '../stores/profileStore';
import { TProfile } from '../types';
import { generateRecordId, getCurrentUTCTimeStamp } from '../utils';

const useProfiles = () => {
  const addProfile = useProfileStore(state => state.addProfile);
  const profiles = useProfileStore(state => state.profiles);
  const setProfiles = useProfileStore(state => state.setProfiles);

  const createProfile = async (profileName: string) => {
    const profile: TProfile = {
      name: profileName,
      id: generateRecordId(),
      createdAt: getCurrentUTCTimeStamp(),
    };
    const profileCreateResults = await profileRepository.add(profile);
    console.log({ t: profileCreateResults });
    addProfile(profile);
    return profile;
  };

  useEffect(() => {
    profileRepository.getAll().then(data => {
      console.log({ data });
    });
  }, []);

  return {
    createProfile,
    profiles,
  };
};

export default useProfiles;
