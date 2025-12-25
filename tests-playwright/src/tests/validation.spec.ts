import { test, expect } from '@playwright/test';
import { validateAmount, validateAccountId, validateTransfer } from '../utils/validation';

test.describe('Amount Validation - Unit Tests', () => {
  test('accepts valid positive amounts', () => {
    expect(validateAmount(100).isValid).toBe(true);
    expect(validateAmount(0.01).isValid).toBe(true);
    expect(validateAmount(1000000.99).isValid).toBe(true);
    expect(validateAmount('250.50').isValid).toBe(true);
  });

  test('rejects zero amount', () => {
    const result = validateAmount(0);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('greater than zero');
  });

  test('rejects negative amounts', () => {
    const result = validateAmount(-50);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('positive number');
  });

  test('rejects non-numeric values', () => {
    const result = validateAmount('abc');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('valid number');
  });

  test('rejects null and undefined', () => {
    const nullResult = validateAmount(null);
    expect(nullResult.isValid).toBe(false);
    expect(nullResult.error).toContain('required');

    const undefinedResult = validateAmount(undefined);
    expect(undefinedResult.isValid).toBe(false);
    expect(undefinedResult.error).toContain('required');
  });

  test('rejects empty string', () => {
    const result = validateAmount('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('required');
  });

  test('rejects amounts with more than 2 decimal places', () => {
    const result = validateAmount(100.123);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('2 decimal places');
  });

  test('accepts string representations of valid numbers', () => {
    expect(validateAmount('100').isValid).toBe(true);
    expect(validateAmount('50.99').isValid).toBe(true);
  });
});

test.describe('Account ID Validation - Unit Tests', () => {
  test('accepts valid account IDs', () => {
    expect(validateAccountId('ACC-001').isValid).toBe(true);
    expect(validateAccountId('ACC-002').isValid).toBe(true);
    expect(validateAccountId('ACC-999').isValid).toBe(true);
  });

  test('rejects invalid format', () => {
    const result = validateAccountId('INVALID-ID');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('format');
  });

  test('rejects non-string values', () => {
    const result = validateAccountId(123);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('non-empty string');
  });

  test('rejects null and undefined', () => {
    expect(validateAccountId(null).isValid).toBe(false);
    expect(validateAccountId(undefined).isValid).toBe(false);
  });

  test('rejects empty string', () => {
    const result = validateAccountId('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('non-empty string');
  });

  test('rejects incorrect number of digits', () => {
    expect(validateAccountId('ACC-01').isValid).toBe(false);
    expect(validateAccountId('ACC-0001').isValid).toBe(false);
  });

  test('rejects missing prefix', () => {
    const result = validateAccountId('001');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('format');
  });
});

test.describe('Transfer Validation - Unit Tests', () => {
  test('accepts valid transfer data', () => {
    const result = validateTransfer('ACC-001', 'ACC-002', 100.50);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('rejects invalid source account', () => {
    const result = validateTransfer('INVALID', 'ACC-002', 100);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Source account');
  });

  test('rejects invalid destination account', () => {
    const result = validateTransfer('ACC-001', 'INVALID', 100);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Destination account');
  });

  test('rejects invalid amount', () => {
    const result = validateTransfer('ACC-001', 'ACC-002', 0);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('zero');
  });

  test('rejects same source and destination', () => {
    const result = validateTransfer('ACC-001', 'ACC-001', 100);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('must be different');
  });

  test('rejects negative amount in transfer', () => {
    const result = validateTransfer('ACC-001', 'ACC-002', -50);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('positive');
  });

  test('rejects non-numeric amount in transfer', () => {
    const result = validateTransfer('ACC-001', 'ACC-002', 'xyz');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('valid number');
  });

  test('validates all fields together', () => {
    // Missing source
    expect(validateTransfer(null, 'ACC-002', 100).isValid).toBe(false);
    
    // Missing destination
    expect(validateTransfer('ACC-001', null, 100).isValid).toBe(false);
    
    // Missing amount
    expect(validateTransfer('ACC-001', 'ACC-002', null).isValid).toBe(false);
  });
});

test.describe('Edge Cases - Unit Tests', () => {
  test('handles very large amounts', () => {
    const result = validateAmount(999999999.99);
    expect(result.isValid).toBe(true);
  });

  test('handles very small amounts', () => {
    const result = validateAmount(0.01);
    expect(result.isValid).toBe(true);
  });

  test('handles string amounts with whitespace', () => {
    const result = validateAmount('  100.50  ');
    expect(result.isValid).toBe(true);
  });

  test('rejects Infinity', () => {
    const result = validateAmount(Infinity);
    expect(result.isValid).toBe(false);
  });

  test('rejects NaN', () => {
    const result = validateAmount(NaN);
    expect(result.isValid).toBe(false);
  });

  test('handles account IDs with different casing', () => {
    // Should reject - format is case-sensitive
    expect(validateAccountId('acc-001').isValid).toBe(false);
    expect(validateAccountId('Acc-001').isValid).toBe(false);
  });
});
