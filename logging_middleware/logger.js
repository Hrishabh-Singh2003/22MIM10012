/**
 * Logging Middleware
 * A structured logger used across the campus notification platform.
 * Replaces console.log with structured, leveled logging.
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LEVEL_LABELS = {
  0: "DEBUG",
  1: "INFO",
  2: "WARN",
  3: "ERROR",
};

class Logger {
  constructor(context = "App", minLevel = LOG_LEVELS.DEBUG) {
    this.context = context;
    this.minLevel = minLevel;
    this.logs = [];
  }

  _formatTimestamp() {
    return new Date().toISOString();
  }

  _log(level, message, meta = {}) {
    if (level < this.minLevel) return;

    const entry = {
      timestamp: this._formatTimestamp(),
      level: LEVEL_LABELS[level],
      context: this.context,
      message,
      ...(Object.keys(meta).length > 0 ? { meta } : {}),
    };

    this.logs.push(entry);
    const output = `[${entry.timestamp}] [${entry.level}] [${entry.context}] ${message}`;
    process.stdout.write(output + (Object.keys(meta).length > 0 ? " | meta: " + JSON.stringify(meta) : "") + "\n");
  }

  debug(message, meta = {}) {
    this._log(LOG_LEVELS.DEBUG, message, meta);
  }

  info(message, meta = {}) {
    this._log(LOG_LEVELS.INFO, message, meta);
  }

  warn(message, meta = {}) {
    this._log(LOG_LEVELS.WARN, message, meta);
  }

  error(message, meta = {}) {
    this._log(LOG_LEVELS.ERROR, message, meta);
  }

  getLogs() {
    return this.logs;
  }

  createChild(childContext) {
    return new Logger(`${this.context}:${childContext}`, this.minLevel);
  }
}

module.exports = { Logger, LOG_LEVELS };
