import { processKey, roastKeys, roastStep } from './coffee-profile.util';

describe('coffee profile matching', () => {
  it('places label roast levels on the five-step scale', () => {
    expect(roastStep('Light')).toBe(0);
    expect(roastStep('LIGHT MEDIUM')).toBe(1);
    expect(roastStep('Light-Medium')).toBe(1);
    expect(roastStep('Medium')).toBe(2);
    expect(roastStep('Medium Dark')).toBe(3);
    expect(roastStep('Dark')).toBe(4);
    expect(roastStep('คั่วอ่อน')).toBe(0);
    expect(roastStep('Mittel-dunkel')).toBe(3);
  });

  it('leaves unknown or empty roast text unlinked', () => {
    expect(roastStep('Omni roast')).toBeNull();
    expect(roastStep(null)).toBeNull();
    expect(roastKeys(null)).toEqual([]);
  });

  it('links in-between roasts to both neighbouring explainers', () => {
    expect(roastKeys(1)).toEqual(['light', 'medium']);
    expect(roastKeys(3)).toEqual(['medium', 'dark']);
    expect(roastKeys(4)).toEqual(['dark']);
  });

  it('recognises the processing method on a label', () => {
    expect(processKey('Washed')).toBe('washed');
    expect(processKey('NATURAL')).toBe('natural');
    expect(processKey('Dry process')).toBe('natural');
    expect(processKey('Honey')).toBe('honey');
    expect(processKey('Black honey')).toBe('honey');
    expect(processKey('Anaerobic')).toBeNull();
  });
});
