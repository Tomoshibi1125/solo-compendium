import { describe, it, expect, vi } from 'vitest';
import { createLogger } from './logger';

describe('createLogger', () => {
  it('logs all levels in development mode', () => {
    const sink = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    };

    const logger = createLogger({
      mode: 'development',
      sink,
      criticalPatterns: [],
    });

    logger.log('info');
    logger.warn('warn');
    logger.error('error');
    logger.debug('debug');

    expect(sink.log).toHaveBeenCalledWith('info');
    expect(sink.warn).toHaveBeenCalledWith('warn');
    expect(sink.error).toHaveBeenCalledWith('error');
    expect(sink.debug).toHaveBeenCalledWith('debug');
  });

  it('filters non-critical logs in production mode', () => {
    const sink = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    };

    const logger = createLogger({
      mode: 'production',
      sink,
      criticalPatterns: ['root element not found'],
    });

    logger.log('critical info');
    logger.debug('critical debug');
    logger.warn('non-critical warning');
    logger.error(new Error('root element not found'));
    logger.warn('root element not found');

    expect(sink.log).not.toHaveBeenCalled();
    expect(sink.debug).not.toHaveBeenCalled();
    expect(sink.warn).toHaveBeenCalledTimes(1);
    expect(sink.warn).toHaveBeenCalledWith('root element not found');
    expect(sink.error).toHaveBeenCalledTimes(1);
  });
});
