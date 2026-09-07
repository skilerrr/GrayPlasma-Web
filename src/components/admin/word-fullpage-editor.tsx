"use client";

import React from "react";
import { WordDocsStudio, WordStudioDocument } from "@/components/admin/word-docs-studio";

export interface WordDocumentData {
  id?: string;
  title: string;
  category?: string;
  tags?: string[];
  isImportant?: boolean;
  content: string; // HTML or Markdown
  extraMeta?: Record<string, any>;
}

interface WordFullpageEditorProps {
  isOpen: boolean;
  documentTypeLabel?: string;
  initialData: WordDocumentData;
  onSave: (doc: WordDocumentData) => void;
  onClose: () => void;
}

export function WordFullpageEditor({
  isOpen,
  initialData,
  onSave,
  onClose,
}: WordFullpageEditorProps) {
  const convertedData: WordStudioDocument = {
    id: initialData.id || `doc-${Date.now()}`,
    title: initialData.title || "",
    category: initialData.category || "General",
    tags: initialData.tags || [],
    isImportant: initialData.isImportant || false,
    content: initialData.content || "",
    extraMeta: initialData.extraMeta || {},
  };

  return (
    <WordDocsStudio
      isOpen={isOpen}
      modeType="faq"
      initialData={convertedData}
      onSave={(savedDoc) => {
        onSave({
          id: savedDoc.id,
          title: savedDoc.title,
          category: savedDoc.category,
          tags: savedDoc.tags,
          isImportant: savedDoc.isImportant,
          content: savedDoc.content,
          extraMeta: savedDoc.extraMeta,
        });
      }}
      onClose={onClose}
    />
  );
}
