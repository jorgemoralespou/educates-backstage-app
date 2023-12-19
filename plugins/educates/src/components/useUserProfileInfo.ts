// Copied from https://github.com/backstage/backstage/blob/master/plugins/user-settings/src/components/useUserProfileInfo.ts
// import {
//   alertApiRef,
//   identityApiRef,
//   ProfileInfo,
//   useApi,
// } from '@backstage/core-plugin-api';
// import { useEffect } from 'react';
// import useAsync from 'react-use/lib/useAsync';

/** @public */
export const useUserProfile = () => {
  // const identityApi = useApi(identityApiRef);
  // const alertApi = useApi(alertApiRef);

  // const { value, loading, error } = useAsync(async () => {
  //   return {
  //     profile: await identityApi.getProfileInfo(),
  //     identity: await identityApi.getBackstageIdentity(),
  //   };
  // }, []);

  // useEffect(() => {
  //   if (error) {
  //     alertApi.post({
  //       message: `Failed to load user identity: ${error}`,
  //       severity: 'error',
  //     });
  //   }
  // }, [error, alertApi]);

  // if (loading || error) {
  //   return {
  //     profile: {} as ProfileInfo,
  //     name: '',
  //     loading,
  //   };
  // }

  return {
    profile: 'value!.profile',
    backstageIdentity: 'value!.identity',
    name: 'jorge', // for now not use: value!.profile.displayName ?? value!.identity.userEntityRef,
    loading: false,
  };
};
