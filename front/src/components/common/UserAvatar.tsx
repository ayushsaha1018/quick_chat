import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  image?: string;
  name?: string;
}

export function UserAvatar({ image, name }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={image} />
      <AvatarFallback>{name ? name[0] : "?"}</AvatarFallback>
    </Avatar>
  );
}
