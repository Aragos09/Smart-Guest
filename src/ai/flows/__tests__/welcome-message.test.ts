import { describe, it, expect, vi } from 'vitest';

// Mock the entire @/ai/genkit module
vi.mock('@/ai/genkit', () => {
  const mockPrompt = vi.fn().mockResolvedValue({
    output: {
      welcomeMessage: "Mocked welcome message for John"
    }
  });
  return {
    ai: {
      definePrompt: () => mockPrompt,
      defineFlow: (config: any, fn: any) => fn,
    }
  };
});

import { generateDynamicWelcomeMessage } from '../dynamic-welcome-message';

describe('generateDynamicWelcomeMessage flow', () => {
  it('should call the mocked flow and return welcomeMessage', async () => {
    const result = await generateDynamicWelcomeMessage({
      userName: "John",
      travelHistory: "Last stay was in an eco-suite.",
      userPreferences: "Quiet room",
      ecoSensitivity: "high",
      newOptions: "Electric bike rental",
      language: "en"
    });
    
    expect(result).toEqual({
      welcomeMessage: "Mocked welcome message for John"
    });
  });
});
