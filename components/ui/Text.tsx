import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

interface TextProps extends RNTextProps {
  className?: string;
}

export function Text({ className = "", ...props }: TextProps) {
  // This is a simplified version - in a real app you might use something like
  // twrnc or nativewind for proper Tailwind support
  const getStyle = () => {
    const classes = className.split(" ");
    const style: any = {};
    
    classes.forEach(cls => {
      if (cls === "font-bold") style.fontWeight = "bold";
      if (cls === "text-xl") style.fontSize = 20;
      if (cls === "text-2xl") style.fontSize = 24;
      if (cls.startsWith("text-")) {
        const color = cls.split("-")[1];
        if (color === "gray") style.color = "#6b7280";
        // Add more color mappings as needed
      }
    });
    
    return style;
  };

  return <RNText style={[getStyle(), props.style]} {...props} />;
}