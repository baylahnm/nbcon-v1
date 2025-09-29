import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyOption } from '@/types/project';

const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rate: 3.75 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
];

interface CurrencyContextType {
  currentCurrency: CurrencyOption;
  setCurrentCurrency: (currency: CurrencyOption) => void;
  convertAmount: (amount: number, fromCurrency?: string) => number;
  formatAmount: (amount: number, currency?: string) => string;
  currencies: CurrencyOption[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyOption>(CURRENCIES[0]);

  // Load saved currency preference
  useEffect(() => {
    const saved = localStorage.getItem('preferred-currency');
    if (saved) {
      const currency = CURRENCIES.find(c => c.code === saved);
      if (currency) {
        setCurrentCurrencyState(currency);
      }
    }
  }, []);

  const setCurrentCurrency = (currency: CurrencyOption) => {
    setCurrentCurrencyState(currency);
    localStorage.setItem('preferred-currency', currency.code);
  };

  const convertAmount = (amount: number, fromCurrency?: string): number => {
    if (!fromCurrency || fromCurrency === currentCurrency.code) {
      return amount;
    }
    
    const fromRate = CURRENCIES.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currentCurrency.rate;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  };

  const formatAmount = (amount: number, currency?: string): string => {
    const targetCurrency = currency ? CURRENCIES.find(c => c.code === currency) : currentCurrency;
    if (!targetCurrency) return amount.toString();
    
    const convertedAmount = convertAmount(amount, currency);
    
    return `${targetCurrency.symbol}${convertedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const contextValue = {
    currentCurrency,
    setCurrentCurrency,
    convertAmount,
    formatAmount,
    currencies: CURRENCIES,
  };

  return React.createElement(
    CurrencyContext.Provider,
    { value: contextValue },
    children
  );
};
