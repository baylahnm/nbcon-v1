import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/pages/1-HomePage/others/components/ui/select";

interface BillingAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

interface BillingAddressFormProps {
  value: BillingAddress;
  onChange: (value: BillingAddress) => void;
  errors?: Partial<Record<keyof BillingAddress, string>>;
}

const SAUDI_REGIONS = [
  'Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir', 
  'Tabuk', 'Qassim', 'Ha\'il', 'Northern Borders', 'Jazan', 
  'Najran', 'Al Bahah', 'Al Jouf'
];

const COUNTRIES = [
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'QA', name: 'Qatar' },
  { code: 'OM', name: 'Oman' },
  { code: 'BH', name: 'Bahrain' },
];

export function BillingAddressForm({ value, onChange, errors }: BillingAddressFormProps) {
  const updateField = (field: keyof BillingAddress, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street">
          Street Address
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="street"
          value={value.street}
          onChange={(e) => updateField('street', e.target.value)}
          placeholder="Building number, street name"
        />
        {errors?.street && <p className="text-sm text-destructive">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            City
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="city"
            value={value.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="Enter city"
          />
          {errors?.city && <p className="text-sm text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">
            Region/Province
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={value.region} onValueChange={(val) => updateField('region', val)}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {SAUDI_REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.region && <p className="text-sm text-destructive">{errors.region}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal-code">
            Postal Code
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="postal-code"
            value={value.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            placeholder="12345"
            maxLength={5}
          />
          {errors?.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">
            Country
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={value.country} onValueChange={(val) => updateField('country', val)}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.country && <p className="text-sm text-destructive">{errors.country}</p>}
        </div>
      </div>
    </div>
  );
}

