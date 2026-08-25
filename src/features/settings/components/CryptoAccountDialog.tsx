import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useInstitutions } from "@/features/settings/hooks/useInstitutions";
import { useAssetTypes } from "@/features/settings/hooks/useAssetTypes";
import { useCryptoAccounts } from "@/features/settings/hooks/useCryptoAccounts";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, HelpCircle } from "lucide-react";

interface CryptoAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = {
  label: "",
  institutionId: "",
  assetType: "",
  apiKey: "",
  apiSecret: "",
};

export const CryptoAccountDialog = ({
  open,
  onOpenChange,
}: CryptoAccountDialogProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialState);

  const { institutions, isLoading: isLoadingInstitutions } = useInstitutions(
    undefined,
    { enabled: open },
  );
  const { assetTypes, isLoading: isLoadingTypes } = useAssetTypes(undefined, {
    enabled: open,
  });
  const { connectAccount, isConnecting } = useCryptoAccounts({
    enabled: false,
  });

  useEffect(() => {
    if (open && institutions.length && !formData.institutionId) {
      setFormData((prev) => ({
        ...prev,
        institutionId: institutions[0].id.toString(),
      }));
    }
  }, [open, institutions, formData.institutionId]);

  useEffect(() => {
    if (open && assetTypes.length && !formData.assetType) {
      setFormData((prev) => ({ ...prev, assetType: assetTypes[0].name }));
    }
  }, [open, assetTypes, formData.assetType]);

  const updateField = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => setFormData(initialState);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) resetForm();
  };

  const validateForm = (): boolean => {
    if (!formData.institutionId) {
      toast.error(t("settings.cryptoAccounts.validation.institutionRequired"));
      return false;
    }
    if (!formData.assetType) {
      toast.error(t("settings.cryptoAccounts.validation.assetTypeRequired"));
      return false;
    }
    if (!formData.apiKey.trim()) {
      toast.error(t("settings.cryptoAccounts.validation.apiKeyRequired"));
      return false;
    }
    if (!formData.apiSecret.trim()) {
      toast.error(t("settings.cryptoAccounts.validation.apiSecretRequired"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await connectAccount({
        type: "mercado_bitcoin",
        label: formData.label.trim() || undefined,
        institutionId: Number(formData.institutionId),
        assetType: formData.assetType,
        apiKey: formData.apiKey.trim(),
        apiSecret: formData.apiSecret.trim(),
      });
      handleOpenChange(false);
    } catch {
      // erro já reportado via toast em useCryptoAccounts; dialog permanece aberto
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[calc(100%-2rem)] overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              {t("settings.cryptoAccounts.dialog.title")}
            </DialogTitle>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={t("settings.cryptoAccounts.dialog.helpAriaLabel")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm">
                <p className="font-medium mb-2">
                  {t("settings.cryptoAccounts.dialog.helpTitle")}
                </p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  {(
                    t("settings.cryptoAccounts.dialog.helpSteps", {
                      returnObjects: true,
                    }) as string[]
                  ).map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">
              {t("settings.cryptoAccounts.fields.label")}
            </Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => updateField("label", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">
              {t("settings.cryptoAccounts.fields.institution")}
            </Label>
            <Select
              value={formData.institutionId}
              onValueChange={(v) => updateField("institutionId", v)}
              disabled={isLoadingInstitutions || institutions.length === 0}
            >
              <SelectTrigger>
                {isLoadingInstitutions ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  <SelectValue />
                )}
              </SelectTrigger>
              <SelectContent>
                {institutions.map((institution) => (
                  <SelectItem
                    key={institution.id}
                    value={institution.id.toString()}
                  >
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetType">
              {t("settings.cryptoAccounts.fields.assetType")}
            </Label>
            <Select
              value={formData.assetType}
              onValueChange={(v) => updateField("assetType", v)}
              disabled={isLoadingTypes || assetTypes.length === 0}
            >
              <SelectTrigger>
                {isLoadingTypes ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  <SelectValue />
                )}
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">
              {t("settings.cryptoAccounts.fields.apiKey")}
            </Label>
            <Input
              id="apiKey"
              value={formData.apiKey}
              onChange={(e) => updateField("apiKey", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t("settings.cryptoAccounts.fields.apiKeyHint")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiSecret">
              {t("settings.cryptoAccounts.fields.apiSecret")}
            </Label>
            <Input
              id="apiSecret"
              type="password"
              value={formData.apiSecret}
              onChange={(e) => updateField("apiSecret", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t("settings.cryptoAccounts.fields.apiSecretHint")}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
            >
              {t("common.buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isConnecting}>
              {isConnecting
                ? t("common.status.saving")
                : t("settings.cryptoAccounts.connect")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
