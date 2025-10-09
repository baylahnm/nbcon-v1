import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/pages/1-HomePage/others/components/ui/radio-group";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/pages/1-HomePage/others/components/ui/tooltip";

interface VATFieldsProps {
  isRegistered: boolean;
  onRegisteredChange: (value: boolean) => void;
  taxId: string;
  onTaxIdChange: (value: string) => void;
  error?: string;
}

export function VATFields({
  isRegistered,
  onRegisteredChange,
  taxId,
  onTaxIdChange,
  error
}: VATFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label>
            Registered for VAT (ZATCA)?
            <span className="text-destructive ml-1">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Required for ZATCA compliance and tax invoice generation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <RadioGroup
          value={isRegistered ? "yes" : "no"}
          onValueChange={(value) => onRegisteredChange(value === "yes")}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="vat-yes" />
            <Label htmlFor="vat-yes" className="font-normal cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="vat-no" />
            <Label htmlFor="vat-no" className="font-normal cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      {isRegistered && (
        <div className="space-y-2 animate-in slide-in-from-top-2">
          <Label htmlFor="tax-id">
            Tax ID (ZATCA)
            <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
          </Label>
          <Input
            id="tax-id"
            name="tax-id"
            value={taxId}
            onChange={(e) => onTaxIdChange(e.target.value)}
            placeholder="Enter your Tax ID"
            maxLength={15}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}

