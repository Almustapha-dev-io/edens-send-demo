import { setUser } from '../..';
import { TAppEndpointBuilder } from '../types';

type TProfileRes = Record<'edensendClient', TUser>;

export const getProfileEndpoints = (builder: TAppEndpointBuilder) => ({
  getProfile: builder.query<TServerResponse<TProfileRes>, void>({
    query: () => '/api/v1/eden_send/client_profile',
    providesTags: ['PROFILE'],
    transformResponse: (res: TServerResponse<TProfileRes>) => res,
    async onQueryStarted(_, { dispatch, queryFulfilled }) {
      try {
        const { data } = await queryFulfilled;
        dispatch(setUser(data.edensendClient));
      } catch (error) {
        console.error(error);
      }
    },
  }),
});
