"use client";

import React, { use } from "react";
import GuideDynamicPage from "@/app/guide/[...slug]/page";

interface CategorySlugPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default function CategorySlugPage({ params }: CategorySlugPageProps) {
  const resolved = use(params);
  
  // Forward parameters as slug array to the unified Notion guide renderer
  const forwardedParams = Promise.resolve({
    slug: [resolved.category, resolved.slug],
  });

  return <GuideDynamicPage params={forwardedParams} />;
}
