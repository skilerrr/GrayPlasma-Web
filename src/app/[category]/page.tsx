"use client";

import React, { use } from "react";
import GuideDynamicPage from "@/app/guide/[...slug]/page";

interface SingleCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function SingleCategoryPage({ params }: SingleCategoryPageProps) {
  const resolved = use(params);

  // Forward single parameter as slug array to the unified Notion guide renderer
  const forwardedParams = Promise.resolve({
    slug: [resolved.category],
  });

  return <GuideDynamicPage params={forwardedParams} />;
}
