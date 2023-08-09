const apiPrefix = {
  tenant: {
    localhost: 'https://notice-api.creams.io',
    notice: 'https://notice-api.creams.io',
    rc: 'https://rc-api.creams.io',
    staging: 'https://staging-api.creams.i/api',
    pro: 'https://app.creams.io/api',
  },
  auth: {
    '1': 'https://notice-api.creams.io',
  },
  demo: {
    '1': '',
    '2': ''
  }
}

const ControllerName: ServerName[] = ['auth', 'demo', 'tenant'];
const ControllerHosts: {
  [key in ServerName]: GenKey<key>[]
} = {
  tenant: ['localhost', 'notice', 'rc', 'staging', 'pro'],
  auth: ['1'],
  demo: ['1', '2'],
};

const len = ControllerName.length;

const getApiPrefix = (url: string, host: string) => {
  let serverName: ServerName = 'tenant';
  let hostName: string = 'localhost';
  for(let i = 0; i < len; i ++) {
    if (url.indexOf(ControllerName[i]) > -1) {
      serverName = ControllerName[i];
      break;
    }
  }

  const hosts = ControllerHosts[serverName];
  const hLen = hosts.length;

  for(let i = 0; i < hLen; i ++) {
    if (host.indexOf(`${hosts[i]}`) > -1) {
      hostName = hosts[i];
      break;
    }
  }

  // @ts-ignore
  return apiPrefix[serverName][hostName]
}


export { getApiPrefix };

type ApiPrefix = typeof apiPrefix;
export type ServerName = keyof typeof apiPrefix;
export type GenKey<T extends ServerName> = keyof ApiPrefix[T]

export type HostBranchName = GenKey<ServerName>;

type EnvConfig<T extends ServerName, M extends GenKey<T>> = Partial<ApiPrefix[T][M]>;

export type HostKeys<T extends ServerName, M extends GenKey<T>> = keyof ApiPrefix[T][M];


const getEnv: <T extends ServerName>(serverName: T, hostName: GenKey<T>) => EnvConfig<T, GenKey<T>> = (serverName, hostName) => {
  return apiPrefix[serverName][hostName]
}

export default getEnv;