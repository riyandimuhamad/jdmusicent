"use client";

import React from "react";
import { useParams } from "next/navigation";
import DefaultTheme from "@/components/invitations/DefaultTheme";
import PrianganTheme from "@/components/invitations/lokal-sunda-priangan";

export default function ThemeDemoRouter() {
  const params = useParams();
  const themeId = params.themeId;

  // Manual theme dispatcher
  if (themeId === "lokal-sunda-priangan") {
    return <PrianganTheme />;
  }

  // Fallback to generic template
  return <DefaultTheme />;
}
