// src/features/chat/components/StatusIcon.tsx
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useUserStatus } from "../hooks";

interface StatusIconProps {
  status?: string;
  isPending?: boolean;
}

export const StatusIcon = ({ status, isPending }: StatusIconProps) => {
  const { getMessageStatus } = useUserStatus();
  const messageStatus = getMessageStatus(status);
  
  if (isPending) {
    return <Ionicons name="time-outline" size={12} color="#999" />;
  }
  
  if (messageStatus.isRead) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="checkmark-outline" size={12} color="#4cd964" />
        <Ionicons name="checkmark-outline" size={12} color="#4cd964" style={{ marginLeft: -9 }} />
      </View>
    );
  }
  
  if (messageStatus.isDelivered) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="checkmark-outline" size={12} color="#8b5cf6" />
        <Ionicons name="checkmark-outline" size={12} color="#8b5cf6" style={{ marginLeft: -9 }} />
      </View>
    );
  }
  
  if (messageStatus.isSent) {
    return <Ionicons name="checkmark-outline" size={12} color="#a1a1aa" />;
  }
  
  return null;
};