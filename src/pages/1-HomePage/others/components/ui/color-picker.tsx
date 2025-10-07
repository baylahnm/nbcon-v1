import { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../../lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Convert HSL string to hex
function hslToHex(hsl: string): string {
  const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!match) return '#000000';
  
  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);
  
  const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l / 100 - c / 2;
  
  let r, g, b;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Convert hex to HSL string
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexValue, setHexValue] = useState(hslToHex(value));
  const [hslValue, setHslValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHslValue(value);
    setHexValue(hslToHex(value));
  }, [value]);

  const handleHexChange = (hex: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const hsl = hexToHsl(hex);
      setHslValue(hsl);
      onChange(hsl);
    }
    setHexValue(hex);
  };

  const handleHslChange = (hsl: string) => {
    setHslValue(hsl);
    setHexValue(hslToHex(hsl));
    onChange(hsl);
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    handleHexChange(hex);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-8 h-8 p-0 border-2"
            style={{ backgroundColor: `hsl(${hslValue})` }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Color Picker</label>
              <div className="mt-2">
                <input
                  ref={inputRef}
                  type="color"
                  value={hexValue}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="w-full h-10 rounded border cursor-pointer"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Hex</label>
              <Input
                value={hexValue}
                onChange={handleColorInputChange}
                placeholder="#000000"
                className="font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">HSL</label>
              <Input
                value={hslValue}
                onChange={(e) => handleHslChange(e.target.value)}
                placeholder="0 0% 0%"
                className="font-mono text-sm"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Input
        value={hslValue}
        onChange={(e) => handleHslChange(e.target.value)}
        placeholder="0 0% 0%"
        className="flex-1 font-mono text-sm"
      />
    </div>
  );
}


