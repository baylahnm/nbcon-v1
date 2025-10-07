import { useState } from "react";
import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { Button } from "@/pages/1-HomePage/others/components/ui/button";
import { Badge } from "@/pages/1-HomePage/others/components/ui/badge";
import { Plus, X } from "lucide-react";

interface MultiEmailInputProps {
  label: string;
  value: string[];
  onChange: (emails: string[]) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export function MultiEmailInput({
  label,
  value,
  onChange,
  required = false,
  placeholder = "email@example.com",
  error
}: MultiEmailInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    const trimmed = inputValue.trim();
    
    if (!trimmed) {
      setInputError("Email cannot be empty");
      return;
    }

    if (!validateEmail(trimmed)) {
      setInputError("Please enter a valid email address");
      return;
    }

    if (value.includes(trimmed)) {
      setInputError("This email has already been added");
      return;
    }

    onChange([...value, trimmed]);
    setInputValue("");
    setInputError("");
  };

  const removeEmail = (email: string) => {
    onChange(value.filter(e => e !== email));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <div className="space-y-3">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className="flex gap-2">
        <Input
          type="email"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setInputError("");
          }}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addEmail}
          size="icon"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {inputError && <p className="text-sm text-destructive">{inputError}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((email, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {email}
              <button
                type="button"
                onClick={() => removeEmail(email)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Press Enter or click + to add email addresses
        </p>
      )}
    </div>
  );
}

