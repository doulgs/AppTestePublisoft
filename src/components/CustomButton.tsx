import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  variant?: "solid" | "outline" | "ghost";
  children?: ReactNode;
  accessibilityLabel?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  loading = false,
  disabled = false,
  onPress,
  style,
  textStyle,
  loadingColor = "#fff",
  icon,
  iconPosition = "left",
  variant = "solid",
  children,
  accessibilityLabel,
  ...rest
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, style];
    if (variant === "outline") {
      baseStyle.push(styles.outlineButton);
    } else if (variant === "ghost") {
      baseStyle.push(styles.ghostButton);
    }
    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }
    return baseStyle;
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={loadingColor} />;
    }
    return (
      <>
        {icon && iconPosition === "left" && icon}
        {children ? children : <Text style={[styles.buttonText, textStyle]}>{title}</Text>}
        {icon && iconPosition === "right" && icon}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  disabledButton: {
    backgroundColor: "#A5A5A5",
    borderColor: "#A5A5A5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 8,
  },
});

export { CustomButton };
