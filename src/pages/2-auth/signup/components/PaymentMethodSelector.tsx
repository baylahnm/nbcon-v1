import { useState } from "react";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/pages/1-HomePage/others/components/ui/radio-group";
import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { CreditCard, Building2, Smartphone } from "lucide-react";
import { Card } from "@/pages/1-HomePage/others/components/ui/card";

interface PaymentMethod {
  type: 'card' | 'bank' | 'applepay';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
  bankName?: string;
  accountNumber?: string;
  iban?: string;
}

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  amount: number;
  currency?: string;
  error?: string;
}

export function PaymentMethodSelector({
  value,
  onChange,
  amount,
  currency = 'SAR',
  error
}: PaymentMethodSelectorProps) {
  const [selectedType, setSelectedType] = useState<PaymentMethod['type']>(value.type || 'card');

  const handleTypeChange = (type: PaymentMethod['type']) => {
    setSelectedType(type);
    onChange({ ...value, type });
  };

  const updateField = <K extends keyof PaymentMethod>(field: K, fieldValue: PaymentMethod[K]) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          Payment Method
          <span className="text-destructive ml-1">*</span>
        </Label>
        <div className="text-sm">
          <span className="text-muted-foreground">Amount: </span>
          <span className="font-semibold">{currency} {amount}/month</span>
        </div>
      </div>

      <RadioGroup value={selectedType} onValueChange={handleTypeChange} className="grid grid-cols-3 gap-4">
        <label htmlFor="card" className="cursor-pointer">
          <Card className={`p-4 flex flex-col items-center gap-2 transition-all ${
            selectedType === 'card' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
          }`}>
            <RadioGroupItem value="card" id="card" className="sr-only" />
            <CreditCard className="w-6 h-6" />
            <span className="text-sm font-medium">Credit Card</span>
          </Card>
        </label>

        <label htmlFor="bank" className="cursor-pointer">
          <Card className={`p-4 flex flex-col items-center gap-2 transition-all ${
            selectedType === 'bank' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
          }`}>
            <RadioGroupItem value="bank" id="bank" className="sr-only" />
            <Building2 className="w-6 h-6" />
            <span className="text-sm font-medium">Bank Transfer</span>
          </Card>
        </label>

        <label htmlFor="applepay" className="cursor-pointer">
          <Card className={`p-4 flex flex-col items-center gap-2 transition-all ${
            selectedType === 'applepay' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
          }`}>
            <RadioGroupItem value="applepay" id="applepay" className="sr-only" />
            <Smartphone className="w-6 h-6" />
            <span className="text-sm font-medium">Apple Pay</span>
          </Card>
        </label>
      </RadioGroup>

      {selectedType === 'card' && (
        <div className="space-y-4 animate-in slide-in-from-top-2">
          <div className="space-y-2">
            <Label htmlFor="card-name">Cardholder Name</Label>
            <Input
              id="card-name"
              name="cc-name"
              value={value.cardName || ''}
              onChange={(e) => updateField('cardName', e.target.value)}
              placeholder="Name on card"
              autoComplete="cc-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input
              id="card-number"
              name="cc-number"
              value={value.cardNumber || ''}
              onChange={(e) => {
                const formatted = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                updateField('cardNumber', formatted);
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              autoComplete="cc-number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-expiry">Expiry Date</Label>
              <Input
                id="card-expiry"
                name="cc-exp"
                value={value.cardExpiry || ''}
                onChange={(e) => {
                  const formatted = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                  updateField('cardExpiry', formatted);
                }}
                placeholder="MM/YY"
                maxLength={5}
                autoComplete="cc-exp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-cvv">CVV</Label>
              <Input
                id="card-cvv"
                name="cc-csc"
                type="password"
                value={value.cardCvv || ''}
                onChange={(e) => updateField('cardCvv', e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                maxLength={3}
                autoComplete="cc-csc"
              />
            </div>
          </div>
        </div>
      )}

      {selectedType === 'bank' && (
        <div className="space-y-4 animate-in slide-in-from-top-2">
          <div className="space-y-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              name="bank-name"
              value={value.bankName || ''}
              onChange={(e) => updateField('bankName', e.target.value)}
              placeholder="e.g., Al Rajhi Bank"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              name="iban"
              value={value.iban || ''}
              onChange={(e) => updateField('iban', e.target.value.toUpperCase())}
              placeholder="SA00 0000 0000 0000 0000 0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-number">Account Number</Label>
            <Input
              id="account-number"
              name="account-number"
              value={value.accountNumber || ''}
              onChange={(e) => updateField('accountNumber', e.target.value)}
              placeholder="Enter account number"
            />
          </div>
        </div>
      )}

      {selectedType === 'applepay' && (
        <div className="p-4 bg-muted rounded-lg text-center animate-in slide-in-from-top-2">
          <p className="text-sm text-muted-foreground">
            You will be redirected to Apple Pay to complete your payment
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

