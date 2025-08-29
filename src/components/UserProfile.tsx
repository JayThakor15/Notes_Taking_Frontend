import React, { useState, useRef } from "react";
import { Avatar, Button, Paper, Popover, Typography } from "@mui/material";
import { Person, CloudUpload } from "@mui/icons-material";
import API from "../utils/api";

interface UserProfileProps {
  name: string;
  email: string;
  profilePicture?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  profilePicture,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentProfilePic, setCurrentProfilePic] = useState<string>(
    profilePicture || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await API.post("/users/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCurrentProfilePic(response.data.profilePicture);
      // Update the user info in localStorage
      const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userInfo,
          profilePicture: response.data.profilePicture,
        })
      );
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setUploading(false);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <div className="relative">
      <div
        onClick={handleClick}
        className="cursor-pointer transition-transform hover:scale-105"
      >
        <Avatar
          src={currentProfilePic}
          sx={{
            width: 40,
            height: 40,
            bgcolor: currentProfilePic ? "transparent" : "#1976d2",
          }}
        >
          {!currentProfilePic && <Person />}
        </Avatar>
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Paper className="p-4 min-w-[250px]">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              src={currentProfilePic}
              sx={{
                width: 80,
                height: 80,
                bgcolor: currentProfilePic ? "transparent" : "#1976d2",
              }}
            >
              {!currentProfilePic && <Person sx={{ fontSize: 40 }} />}
            </Avatar>

            <div className="text-center">
              <Typography variant="h6">{name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {email}
              </Typography>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={handleUploadClick}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Profile Picture"}
            </Button>
          </div>
        </Paper>
      </Popover>
    </div>
  );
};

export default UserProfile;
