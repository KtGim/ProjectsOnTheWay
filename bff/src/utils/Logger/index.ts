import log4js, { Logger } from 'log4js'

type logLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark';

interface InstanceLogger extends Logger {
  logOut?: Function;
}

class Log {
  private loggers: {[key in string]?: Logger }

  constructor() {
    this.loggers = {};
  }

  createLoggerKey(level: logLevel): string {
    return `${level}Logger`;
  }

  create(level: logLevel): InstanceLogger {
    const loggerKey = this.createLoggerKey(level);
    let levelLogger = this.loggers[loggerKey];

    if (levelLogger) {
      return levelLogger as InstanceLogger;
    }

    const logInstance: InstanceLogger  = log4js.getLogger();
    logInstance.level = level;
    logInstance.logOut = logInstance[level];

    levelLogger = logInstance;
    return levelLogger as InstanceLogger;
  }

  get(level: logLevel): InstanceLogger {
    const loggerKey = this.createLoggerKey(level);
    let levelLogger = this.loggers[loggerKey];
    if (!levelLogger) {
      levelLogger = this.create(level)
    }
    return levelLogger;
  }
}

const LoggerInstance = new Log();

export default LoggerInstance;

export const errorLog = LoggerInstance.get('error');
export const infoLog = LoggerInstance.get('info');
export const debugLog = LoggerInstance.get('debug');
