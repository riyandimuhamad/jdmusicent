"use client";

import React from "react";
import DefaultTheme from "@/components/invitations/DefaultTheme";

export default function ThemeDemoRouter() {
  // We now use a single dynamic smart template (DefaultTheme) for all themes.
  // It automatically handles dynamic colors, layouts, and cultural ornaments
  // based on the themeId parameter read from the URL within the component.
  return <DefaultTheme />;
}
