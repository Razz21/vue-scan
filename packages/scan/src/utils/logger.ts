type LogLevel = 'log' | 'debug' | 'warn' | 'error';
type LogOptions = {
  enabled?: boolean;
};

export const createLogger = (prefix: string, options: LogOptions = {}) => {
  const opts = { enabled: true, ...options };

  const prefixText = prefix ? `[${prefix}]` : '';

  const _log = (level: LogLevel, color: string, ...args: any[]) => {
    if (opts.enabled === false) return;

    console[level](
      `%c${prefixText} [${level.toUpperCase()}]`,
      `color: ${color}; font-weight: bold;`,
      ...args
    );
  };

  return {
    log: (...args: any[]) => _log('log', '#3bc736', ...args),
    debug: (...args: any[]) => _log('debug', '#00c9c9', ...args),
    warn: (...args: any[]) => _log('warn', '#ff9800', ...args),
    error: (...args: any[]) => _log('error', '#f44336', ...args),

    setOptions: (options: LogOptions) => Object.assign(opts, options),
  };
};

export const logger = createLogger('vue-scan');
