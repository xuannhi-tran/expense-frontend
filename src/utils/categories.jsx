import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  Tag,
} from "lucide-react";

export const CATEGORY_COLORS = {
  Food: "#f59e0b",
  Transport: "#3b82f6",
  Shopping: "#8b5cf6",
  Utilities: "#10b981",
  Bills: "#10b981",
  Entertainment: "#ec4899",
  Health: "#ef4444",
  Other: "#64748b",
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
};

export const getCategoryIcon = (category, size = 18) => {
  switch (category) {
    case "Food":
      return <UtensilsCrossed size={size} />;
    case "Transport":
      return <Car size={size} />;
    case "Shopping":
      return <ShoppingBag size={size} />;
    case "Utilities":
    case "Bills":
      return <Zap size={size} />;
    case "Entertainment":
      return <Film size={size} />;
    case "Health":
      return <HeartPulse size={size} />;
    default:
      return <Tag size={size} />;
  }
};
