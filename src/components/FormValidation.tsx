interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validateBetData = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.sport) errors.push('Sport is required');
  if (!data.team) errors.push('Team is required');
  if (!data.opponent) errors.push('Opponent is required');
  if (!data.betType) errors.push('Bet type is required');
  if (!data.odds) errors.push('Odds are required');
  if (!data.stake || data.stake <= 0) errors.push('Stake must be greater than 0');
  if (!data.date) errors.push('Date is required');
  
  return { isValid: errors.length === 0, errors };
};

interface ErrorMessageProps {
  errors: string[];
}

export function ErrorMessage({ errors }: ErrorMessageProps) {
  if (errors.length === 0) return null;
  
  return (
    <div className="mt-2">
      {errors.map((error, index) => (
        <p key={index} className="text-red-400 text-sm">{error}</p>
      ))}
    </div>
  );
}