import React from 'react';
import { render, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { LanguageProvider, useLanguage } from '../language-context';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock user profile context
const mockSetProfile = vi.fn();
let mockProfile = { language: 'en', name: 'John Doe' };

vi.mock('../user-profile-context', () => ({
  useUserProfile: () => ({
    profile: mockProfile,
    setProfile: mockSetProfile,
  }),
}));

// Mock next/navigation since usePathname is used in LanguageProvider
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

// Mock window.location.reload
const originalReload = window.location ? window.location.reload : undefined;

beforeEach(() => {
  mockProfile = { language: 'en', name: 'John' };
  mockSetProfile.mockReset();
  
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        pathname: '/dashboard',
        hash: '',
        search: '',
      },
    });
  }
});

function TestComponent() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="welcome">{t('hello_user')}</span>
      <button onClick={() => setLanguage('fr')}>Switch to French</button>
    </div>
  );
}

describe('LanguageContext', () => {
  it('should initialize with profile language and translate keys', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('welcome')).toHaveTextContent('Hello');
  });

  it('should update language and trigger reload', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    act(() => {
      screen.getByText('Switch to French').click();
    });

    expect(mockSetProfile).toHaveBeenCalledWith(
      expect.objectContaining({ language: 'fr' })
    );
    expect(window.location.reload).toHaveBeenCalled();
  });
});
