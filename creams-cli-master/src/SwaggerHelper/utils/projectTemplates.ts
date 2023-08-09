import { ProjectType } from '../generate/interfaces'

export default function (type: ProjectType) {
  return {
    'CREAMS_MAIN': {
      requestPath: `import request from '@/utils/request';`,
      stringifyPath: `import stringify from '@/utils/stringify';`,
      bodyStr: '\n\t\tbody,',
    },
    'TENANT_H5': {
      requestPath: `import request from '../utils/request';`,
      stringifyPath: `import stringify from '../utils/stringify';`,
      bodyStr: 'data: body,',
    }
  }[type]
}
