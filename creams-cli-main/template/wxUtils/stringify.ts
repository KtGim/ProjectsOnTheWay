interface Options {
  delimiter: string;
}

const stringify = (payload: any, options?: Options) => {
  const { delimiter = '&' } = options ? options : {};
  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.join(',');
  }

  if (typeof payload === 'object') {
    return Object.keys(payload)
      .map(key => {
        let value = payload[key];
        if (typeof value === 'undefined') return undefined;

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return;
          }
          value = value.map(item => encodeURIComponent(item));
        } else {
          value = encodeURIComponent(value);
        }

        return `${encodeURIComponent(key)}=${value}`;
      })
      .filter(Boolean)
      .join(delimiter);
  }
  return payload.toString();
};

export default stringify;
