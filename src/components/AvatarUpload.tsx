import React, { useState, useRef, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { supabase } from "../integrations/supabase/client";
import { showSuccess, showError } from "../utils/toast";

interface AvatarUploadProps {
  currentAvatar: string;
  userName: string;
  onAvatarUpdate: (newAvatar: string) => void;
  accentColor: string;
}

export function AvatarUpload({ currentAvatar, userName, onAvatarUpdate, accentColor }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    };
    getUser();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        showError("Please select an image file");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        showError("Image must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadAvatar = async () => {
    if (!file || !userId) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const newAvatarUrl = publicData.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar: newAvatarUrl },
      });

      if (updateError) throw updateError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", userId);

      if (profileError) throw profileError;

      onAvatarUpdate(newAvatarUrl);
      showSuccess("Avatar updated successfully!");
      setIsOpen(false);
    } catch (error: any) {
      showError(error.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
      setFile(null);
      setPreview(null);
    }
  };

  const removeAvatar = async () => {
    if (!userId) return;
    
    try {
      const defaultAvatar = `https://api.dicebear.com/7.x/initialism/svg?seed=${userName}`;
      await supabase.auth.updateUser({
        data: { avatar: defaultAvatar },
      });
      onAvatarUpdate(defaultAvatar);
      showSuccess("Avatar reset to default");
      setIsOpen(false);
    } catch (error: any) {
      showError(error.message || "Failed to reset avatar");
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <Camera className="h-4 w-4 mr-1.5" />
        Change Avatar
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">Upload Avatar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-slate-200 dark:border-slate-700">
                  <AvatarImage src={preview || currentAvatar} alt={userName} />
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                {preview && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-white dark:bg-slate-900 shadow"
                    onClick={() => setPreview(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Choose Image
              </Button>
            </div>

            {preview && (
              <div className="flex gap-2">
                <Button
                  onClick={uploadAvatar}
                  disabled={uploading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              onClick={removeAvatar}
              className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
            >
              Reset to Default
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}