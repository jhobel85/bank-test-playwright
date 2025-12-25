/**
 * Validation utilities for banking operations
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a monetary amount
 * @param amount - The amount to validate
 * @returns ValidationResult indicating if amount is valid
 */
export function validateAmount(amount: any): ValidationResult {
  // Check if amount is provided
  if (amount === undefined || amount === null || amount === '') {
    return {
      isValid: false,
      error: 'Amount is required'
    };
  }

  // Convert to number
  const numericAmount = Number(amount);

  // Check if conversion resulted in NaN or Infinity
  if (isNaN(numericAmount) || !isFinite(numericAmount)) {
    return {
      isValid: false,
      error: 'Amount must be a valid number'
    };
  }

  // Check if amount is zero
  if (numericAmount === 0) {
    return {
      isValid: false,
      error: 'Amount must be greater than zero'
    };
  }

  // Check if amount is negative
  if (numericAmount < 0) {
    return {
      isValid: false,
      error: 'Amount must be a positive number'
    };
  }

  // Check if amount has too many decimal places (max 2 for currency)
  const decimalPart = String(numericAmount).split('.')[1];
  if (decimalPart && decimalPart.length > 2) {
    return {
      isValid: false,
      error: 'Amount cannot have more than 2 decimal places'
    };
  }

  return {
    isValid: true
  };
}

/**
 * Validates an account ID format
 * @param accountId - The account ID to validate
 * @returns ValidationResult
 */
export function validateAccountId(accountId: any): ValidationResult {
  if (!accountId || typeof accountId !== 'string') {
    return {
      isValid: false,
      error: 'Account ID must be a non-empty string'
    };
  }

  // Basic format check: ACC-XXX
  if (!/^ACC-\d{3}$/.test(accountId)) {
    return {
      isValid: false,
      error: 'Account ID must match format: ACC-XXX'
    };
  }

  return {
    isValid: true
  };
}

/**
 * Validates transfer data
 * @param fromAccountId - Source account ID
 * @param toAccountId - Destination account ID
 * @param amount - Transfer amount
 * @returns ValidationResult
 */
export function validateTransfer(
  fromAccountId: any,
  toAccountId: any,
  amount: any
): ValidationResult {
  // Validate source account
  const fromValidation = validateAccountId(fromAccountId);
  if (!fromValidation.isValid) {
    return {
      isValid: false,
      error: `Source account: ${fromValidation.error}`
    };
  }

  // Validate destination account
  const toValidation = validateAccountId(toAccountId);
  if (!toValidation.isValid) {
    return {
      isValid: false,
      error: `Destination account: ${toValidation.error}`
    };
  }

  // Check if accounts are different
  if (fromAccountId === toAccountId) {
    return {
      isValid: false,
      error: 'Source and destination accounts must be different'
    };
  }

  // Validate amount
  const amountValidation = validateAmount(amount);
  if (!amountValidation.isValid) {
    return amountValidation;
  }

  return {
    isValid: true
  };
}
