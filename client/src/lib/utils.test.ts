import { cn } from './utils';
import { describe, test, expect } from '@jest/globals';

describe('checking cn function', () => {
  
  test('mixing two classes together', () => {
    const output = cn('text-red-500', 'bg-blue-500');
    expect(output).toBe('text-red-500 bg-blue-500');
  });

  test('when some are true and some false', () => {
    const yes = true;
    const no = false;
    
    const finalClass = cn(
      'base-class',
      yes && 'active-class',
      no && 'disabled-class'
    );
    
    expect(finalClass).toBe('base-class active-class');
  });

  test('tailwind verification', () => {
    const changed = cn('p-2', 'p-4');
    expect(changed).toBe('p-4');
  });
});
