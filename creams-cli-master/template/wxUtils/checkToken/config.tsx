import { stringify } from '../locationParse';

const clientId = 'creamscbfa50b75126e41c5';
const clientSecret: string =
  'YpYrANxx5fpMRwy5Z8bfm2ebkdy5BtABanDsqacKGNjzYzJRAiZN6wWA44CTtZOR';
const approachingExpirationTime = 1 * 60 * 1000;

const codeFetchParams: { [key: string]: string } = {
  response_type: 'code',
  client_id: clientId,
  scope: 'CREAMS',
  redirect_uri: `${process.env['login_url_prefix']}&state=${Date.now()}`,
};

const clientOAuth2Params = {
  clientId,
  clientSecret,
  accessTokenUri: `https://${process.env['base_account_prefix']}oauth/token`,
  authorizationUri: `https://${process.env['base_account_prefix']}oauth/authorize`,
  redirectUri: window.location.origin,
  scopes: ['CREAMS'],
  state: Date.now().toString(),
};

const codeFetchUrl = `https://${
  process.env['base_account_prefix']
}oauth/authorize?${stringify(codeFetchParams)}`;

export {
  clientId,
  clientSecret,
  approachingExpirationTime,
  codeFetchParams,
  clientOAuth2Params,
  codeFetchUrl,
};
