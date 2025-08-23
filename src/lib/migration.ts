import { Bet } from '@/types';
import { betApi } from './database';

// Legacy localStorage functions (for migration only)
const STORAGE_KEY = 'betting-tracker-bets';

const loadLegacyBets = (): Bet[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      
      if (!Array.isArray(parsed)) {
        console.warn('Invalid bets data in storage');
        return [];
      }
      
      return parsed.filter(bet => 
        bet && 
        typeof bet === 'object' &&
        typeof bet.id === 'string' &&
        typeof bet.team === 'string' &&
        typeof bet.odds === 'number' &&
        typeof bet.stake === 'number'
      );
    } catch (error) {
      console.error('Error loading legacy bets:', error);
      return [];
    }
  }
  return [];
};

const clearLegacyBets = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Legacy bets cleared from localStorage');
    } catch (error) {
      console.error('Error clearing legacy bets:', error);
    }
  }
};

export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  failedCount: number;
  errors: string[];
  legacyBetsFound: number;
}

export const migrateLegacyData = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    failedCount: 0,
    errors: [],
    legacyBetsFound: 0,
  };

  try {
    // Load legacy bets from localStorage
    const legacyBets = loadLegacyBets();
    result.legacyBetsFound = legacyBets.length;

    if (legacyBets.length === 0) {
      result.success = true;
      return result;
    }

    console.log(`Found ${legacyBets.length} legacy bets to migrate`);

    // Migrate each bet
    for (const legacyBet of legacyBets) {
      try {
        // Convert legacy bet format to new format if needed
        const betToMigrate: Omit<Bet, 'id'> = {
          sport: legacyBet.sport || 'Unknown',
          team: legacyBet.team,
          opponent: legacyBet.opponent || 'Unknown',
          betType: legacyBet.betType || 'moneyline',
          odds: legacyBet.odds,
          stake: legacyBet.stake,
          result: legacyBet.result,
          payout: legacyBet.payout,
          date: legacyBet.date || new Date().toISOString().split('T')[0],
          notes: legacyBet.notes,
        };

        await betApi.createBet(betToMigrate);
        result.migratedCount++;
        
      } catch (error: any) {
        console.error('Failed to migrate bet:', legacyBet, error);
        result.failedCount++;
        result.errors.push(`Failed to migrate bet for ${legacyBet.team}: ${error.message}`);
      }
    }

    // If migration was successful, clear legacy data
    if (result.migratedCount > 0 && result.failedCount === 0) {
      clearLegacyBets();
      result.success = true;
    } else if (result.migratedCount > 0) {
      // Partial success - some bets migrated
      result.success = true;
      console.warn(`Partial migration: ${result.migratedCount} succeeded, ${result.failedCount} failed`);
    }

  } catch (error: any) {
    console.error('Migration failed:', error);
    result.errors.push(`Migration failed: ${error.message}`);
  }

  return result;
};

export const checkForLegacyData = (): boolean => {
  const legacyBets = loadLegacyBets();
  return legacyBets.length > 0;
};

// Component hook for migration
export const useMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState<{
    isChecking: boolean;
    hasLegacyData: boolean;
    isMigrating: boolean;
    migrationResult: MigrationResult | null;
    showMigrationPrompt: boolean;
  }>({
    isChecking: true,
    hasLegacyData: false,
    isMigrating: false,
    migrationResult: null,
    showMigrationPrompt: false,
  });

  const checkLegacyData = () => {
    setMigrationStatus(prev => ({ ...prev, isChecking: true }));
    
    const hasLegacy = checkForLegacyData();
    
    setMigrationStatus(prev => ({
      ...prev,
      isChecking: false,
      hasLegacyData: hasLegacy,
      showMigrationPrompt: hasLegacy,
    }));
  };

  const startMigration = async () => {
    setMigrationStatus(prev => ({ ...prev, isMigrating: true }));
    
    try {
      const result = await migrateLegacyData();
      setMigrationStatus(prev => ({
        ...prev,
        isMigrating: false,
        migrationResult: result,
        showMigrationPrompt: false,
        hasLegacyData: !result.success,
      }));
      
      return result;
    } catch (error) {
      setMigrationStatus(prev => ({
        ...prev,
        isMigrating: false,
        migrationResult: {
          success: false,
          migratedCount: 0,
          failedCount: 0,
          errors: ['Migration failed unexpectedly'],
          legacyBetsFound: 0,
        },
      }));
      
      throw error;
    }
  };

  const dismissMigrationPrompt = () => {
    setMigrationStatus(prev => ({
      ...prev,
      showMigrationPrompt: false,
    }));
  };

  return {
    ...migrationStatus,
    checkLegacyData,
    startMigration,
    dismissMigrationPrompt,
  };
};

// Import useState for the hook
import { useState } from 'react';
