import { useEffect, useState } from 'react';
import { profileRepository } from '../db/repositories/profiles.repo';
import { TProfile } from '../types';
import { generateRecordId, getCurrentUTCTimeStamp } from '../utils';

const useProfiles = () => {
  const [profiles, setProfiles] = useState<TProfile[]>([]);

  const createProfile = async (profileName: string) => {
    const profile: TProfile = {
      name: profileName,
      id: generateRecordId(),
      createdAt: getCurrentUTCTimeStamp(),
    };
    const profileCreateResults = await profileRepository.add(profile);
    console.log({ t: profileCreateResults });
    setProfiles(p => [...p, profile]);
  };

  useEffect(() => {
    profileRepository.getAll().then(data => {
      console.log({ data });
    });
  }, []);

  return {
    createProfile,
  };
};

export default useProfiles;
