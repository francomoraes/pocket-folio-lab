import { useTranslation } from "react-i18next";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X as XIcon } from "lucide-react";
import { authService } from "@/features/auth/services/authService";

export const UserProfile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    locale: user?.locale || "pt-BR",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePictureUrl: user?.profilePictureUrl || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  if (!user) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        toast.error(t("auth.profile.messages.passwordRequired"));
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error(t("auth.profile.messages.passwordMismatch"));
        return;
      }
    }

    setIsLoading(true);
    try {
      await updateUser({
        id: user.id,
        name: formData.name,
        email: formData.email,
        locale: formData.locale,
        profilePictureUrl: formData.profilePictureUrl || null,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword || undefined,
      });
      toast.success(t("auth.profile.messages.success"));
      setIsEditing(false);
      setShowPasswordFields(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(t("auth.profile.messages.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      locale: user?.locale || "pt-BR",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      profilePictureUrl: user?.profilePictureUrl || "",
    });
    setIsEditing(false);
    setShowPasswordFields(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUploadProfilePicture = async (file: File) => {
    setIsLoading(true);
    try {
      const response = await authService.uploadProfilePicture(file);
      handleChange("profilePictureUrl", response.profilePictureUrl);
      toast.success(t("auth.profile.messages.uploadSuccess"));
    } catch (error) {
      toast.error(t("auth.profile.messages.uploadError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-61px)] p-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold">{t("auth.profile.title")}</h2>
        <p className="text-muted-foreground">{t("auth.profile.subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("auth.profile.fields.profilePicture")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={formData.profilePictureUrl}
                alt={formData.name}
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error("Image load error:", e);
                  console.log("URL:", formData.profilePictureUrl);
                }}
              />
              <AvatarFallback className="text-3xl">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2 w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = () => {
                    if (input.files && input.files[0]) {
                      handleUploadProfilePicture(input.files[0]);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t("auth.profile.buttons.uploadPhoto")}
              </Button>

              {formData.profilePictureUrl && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    handleChange("profilePictureUrl", "");
                  }}
                >
                  <XIcon className="h-4 w-4 mr-2" />
                  {t("auth.profile.buttons.removePhoto")}
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground text-center pt-4 border-t w-full">
              <p>
                {t("auth.profile.info.memberSince")}:{" "}
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
              {user.updatedAt && (
                <p className="mt-1">
                  {t("auth.profile.info.lastUpdate")}:{" "}
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("auth.profile.subtitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("auth.profile.fields.name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t("auth.profile.placeholders.name")}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.profile.fields.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={t("auth.profile.placeholders.email")}
              />
            </div>

            {/* Locale */}
            <div className="space-y-2">
              <Label htmlFor="locale">{t("auth.profile.fields.locale")}</Label>
              <Select
                value={formData.locale}
                onValueChange={(value) => handleChange("locale", value)}
              >
                <SelectTrigger id="locale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">🇧🇷 Português (BR)</SelectItem>
                  <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password Section */}
            <div className="pt-4 border-t">
              {!showPasswordFields ? (
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordFields(true)}
                >
                  {t("auth.profile.buttons.changePassword")}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">
                      {t("auth.profile.fields.currentPassword")}
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        handleChange("currentPassword", e.target.value)
                      }
                      placeholder={t(
                        "auth.profile.placeholders.currentPassword",
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">
                      {t("auth.profile.fields.newPassword")}
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleChange("newPassword", e.target.value)
                      }
                      placeholder={t("auth.profile.placeholders.newPassword")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {t("auth.profile.fields.confirmPassword")}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      placeholder={t(
                        "auth.profile.placeholders.confirmPassword",
                      )}
                    />
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowPasswordFields(false);
                      setFormData((prev) => ({
                        ...prev,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }));
                    }}
                  >
                    {t("common.buttons.cancel")}
                  </Button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("common.status.saving")}
                    </>
                  ) : (
                    t("auth.profile.buttons.saveChanges")
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {t("common.buttons.cancel")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
