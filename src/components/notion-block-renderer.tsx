"use client";

import React from "react";
import { Info, AlertTriangle, CheckCircle2, ChevronRight, ExternalLink } from "lucide-react";

interface NotionBlockRendererProps {
  content?: string;
  className?: string;
}

export function NotionBlockRenderer({ content = "", className = "" }: NotionBlockRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let currentList: { type: "bullet" | "number"; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === "bullet") {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1.5 pl-2 my-2 text-xs sm:text-sm text-[#d4d4d4]">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-[#9b9a97] mt-1 text-[10px] leading-none select-none">•</span>
              <span className="flex-1 leading-relaxed">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`list-${elements.length}`} className="space-y-1.5 pl-2 my-2 text-xs sm:text-sm text-[#d4d4d4]">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-[#9b9a97] font-mono text-xs select-none">{idx + 1}.</span>
              <span className="flex-1 leading-relaxed">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Code Block Toggle
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div
            key={`code-${elements.length}`}
            className="my-3 p-3.5 rounded-lg bg-[#121212] border border-[#2f2f2f] font-mono text-xs text-[#58a6ff] overflow-x-auto"
          >
            <pre>{codeBlockLines.join("\n")}</pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Divider Line
    if (line === "---" || line === "***" || line === "___") {
      flushList();
      elements.push(<hr key={`hr-${elements.length}`} className="border-[#2a2a2a] my-6" />);
      continue;
    }

    // Heading 1: #
    if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h1
          key={`h1-${elements.length}`}
          className="text-2xl sm:text-3xl font-extrabold text-[#ffffff] tracking-tight mt-6 mb-2"
        >
          {renderInline(line.replace(/^#\s+/, ""))}
        </h1>
      );
      continue;
    }

    // Heading 2: ##
    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="text-lg sm:text-xl font-bold text-[#ffffff] tracking-tight mt-5 mb-2 pb-1 border-b border-[#2a2a2a]"
        >
          {renderInline(line.replace(/^##\s+/, ""))}
        </h2>
      );
      continue;
    }

    // Heading 3: ###
    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-sm sm:text-base font-bold text-[#f0f0f0] tracking-wide mt-4 mb-1"
        >
          {renderInline(line.replace(/^###\s+/, ""))}
        </h3>
      );
      continue;
    }

    // Callout Box: > or > [!NOTE]
    if (line.startsWith("> ")) {
      flushList();
      const calloutText = line.replace(/^>\s+/, "");
      elements.push(
        <div
          key={`callout-${elements.length}`}
          className="p-3.5 sm:p-4 rounded-xl bg-[#202020] border border-[#2f2f2f] flex items-start gap-3 my-3 text-xs sm:text-sm text-[#d4d4d4] leading-relaxed shadow-sm"
        >
          <Info className="w-4 h-4 text-[#58a6ff] flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">{renderInline(calloutText)}</div>
        </div>
      );
      continue;
    }

    // Bullet List: - or * or •
    if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
      const itemText = line.replace(/^[-*•]\s+/, "");
      if (!currentList || currentList.type !== "bullet") {
        flushList();
        currentList = { type: "bullet", items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Numbered List: 1. 2. etc
    if (/^\d+\.\s+/.test(line)) {
      const itemText = line.replace(/^\d+\.\s+/, "");
      if (!currentList || currentList.type !== "number") {
        flushList();
        currentList = { type: "number", items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Banner Headers: PROS or CONS bar
    if (line === "PROS" || line === "[PROS]") {
      flushList();
      elements.push(
        <div
          key={`pros-bar-${elements.length}`}
          className="w-full py-1.5 px-3 rounded bg-[#193222] border border-[#203c2b] text-[#52ba69] font-bold text-xs tracking-wider my-2 uppercase"
        >
          PROS
        </div>
      );
      continue;
    }

    if (line === "CONS" || line === "[CONS]") {
      flushList();
      elements.push(
        <div
          key={`cons-bar-${elements.length}`}
          className="w-full py-1.5 px-3 rounded bg-[#371e20] border border-[#492224] text-[#eb5757] font-bold text-xs tracking-wider my-2 uppercase"
        >
          CONS
        </div>
      );
      continue;
    }

    // Empty Line
    if (!line) {
      flushList();
      continue;
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="text-xs sm:text-sm text-[#d4d4d4] leading-relaxed my-2">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}

// Helper to render bold, italics, code, links, and tags inline
function renderInline(text: string): React.ReactNode {
  // Regex to tokenize bold, code, links
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // 1. Bold: **text**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    // 2. Code: `code`
    const codeMatch = remaining.match(/`([^`]+)`/);
    // 3. Link: [label](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // 4. Raw URL: https://...
    const urlMatch = remaining.match(/(https?:\/\/[^\s]+)/);

    // Find earliest match
    let earliest: { type: "bold" | "code" | "link" | "url"; index: number; length: number; match: RegExpMatchArray } | null = null;

    if (boldMatch && boldMatch.index !== undefined) {
      earliest = { type: "bold", index: boldMatch.index, length: boldMatch[0].length, match: boldMatch };
    }
    if (codeMatch && codeMatch.index !== undefined && (!earliest || codeMatch.index < earliest.index)) {
      earliest = { type: "code", index: codeMatch.index, length: codeMatch[0].length, match: codeMatch };
    }
    if (linkMatch && linkMatch.index !== undefined && (!earliest || linkMatch.index < earliest.index)) {
      earliest = { type: "link", index: linkMatch.index, length: linkMatch[0].length, match: linkMatch };
    }
    if (urlMatch && urlMatch.index !== undefined && (!earliest || urlMatch.index < earliest.index)) {
      earliest = { type: "url", index: urlMatch.index, length: urlMatch[0].length, match: urlMatch };
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    // Push text preceding match
    if (earliest.index > 0) {
      parts.push(remaining.substring(0, earliest.index));
    }

    // Render match
    if (earliest.type === "bold") {
      parts.push(
        <strong key={`bold-${keyIdx++}`} className="text-[#ffffff] font-bold">
          {earliest.match[1]}
        </strong>
      );
    } else if (earliest.type === "code") {
      parts.push(
        <code
          key={`code-${keyIdx++}`}
          className="px-1.5 py-0.5 rounded bg-[#27272a] text-[#eb5757] font-mono text-[11px]"
        >
          {earliest.match[1]}
        </code>
      );
    } else if (earliest.type === "link") {
      parts.push(
        <a
          key={`link-${keyIdx++}`}
          href={earliest.match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#58a6ff] hover:underline inline-flex items-center gap-0.5"
        >
          <span>{earliest.match[1]}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-75" />
        </a>
      );
    } else if (earliest.type === "url") {
      parts.push(
        <a
          key={`url-${keyIdx++}`}
          href={earliest.match[1]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#58a6ff] hover:underline inline-flex items-center gap-0.5 truncate max-w-xs align-bottom"
        >
          <span className="truncate">{earliest.match[1]}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-75 flex-shrink-0" />
        </a>
      );
    }

    remaining = remaining.substring(earliest.index + earliest.length);
  }

  return <>{parts}</>;
}
