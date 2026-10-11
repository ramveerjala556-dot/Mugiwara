import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Parse code blocks vs markdown text
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-slate-800 break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Code Block
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          let language = 'code';
          let codeBody = part.slice(3, -3).trim();

          // Check if first line is a language specifier
          if (/^[a-zA-Z0-9_-]+$/.test(firstLine)) {
            language = firstLine;
            codeBody = lines.slice(1).join('\n');
          }

          return (
            <div
              key={index}
              className="my-3 rounded-2xl overflow-hidden border border-slate-700/80 bg-[#111827] text-slate-100 shadow-md font-mono text-xs"
            >
              {/* Code block header bar */}
              <div className="flex items-center justify-between px-4 py-1.5 bg-[#1f293d] border-b border-slate-700/60 text-slate-300 text-[11px]">
                <span className="font-semibold uppercase tracking-wider text-amber-300">
                  {language}
                </span>
                <button
                  onClick={() => handleCopy(codeBody, index)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Copy code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code block body */}
              <pre className="p-4 overflow-x-auto text-[11.5px] leading-relaxed selection:bg-amber-400 selection:text-slate-950">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Standard Markdown lines
        return (
          <div key={index} className="space-y-1.5">
            {part.split('\n').map((line, lIdx) => {
              const trimmed = line.trim();

              if (!trimmed) {
                return <div key={lIdx} className="h-1" />;
              }

              // Headers
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="font-extrabold text-sm sm:text-base text-slate-950 mt-2 mb-1">
                    {formatInline(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="font-black text-base sm:text-lg text-slate-950 mt-3 mb-1.5 pb-1 border-b border-slate-200">
                    {formatInline(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2 key={lIdx} className="font-black text-lg sm:text-xl text-slate-950 mt-3 mb-2">
                    {formatInline(trimmed.slice(2))}
                  </h2>
                );
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 ml-1 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{formatInline(trimmed.slice(2))}</span>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 ml-1 text-slate-700">
                    <span className="font-bold text-amber-700 text-xs shrink-0 mt-0.5">
                      {numMatch[1]}.
                    </span>
                    <span>{formatInline(numMatch[2])}</span>
                  </div>
                );
              }

              // Blockquotes
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={lIdx}
                    className="border-l-4 border-amber-400 pl-3 py-1 my-1 italic text-slate-600 bg-amber-50/50 rounded-r-lg"
                  >
                    {formatInline(trimmed.slice(2))}
                  </blockquote>
                );
              }

              // Divider
              if (trimmed === '---' || trimmed === '***') {
                return <hr key={lIdx} className="my-2 border-slate-200" />;
              }

              // Normal paragraph line
              return (
                <p key={lIdx} className="text-slate-800 leading-relaxed">
                  {formatInline(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Inline formatter for bold, italic, and inline code
function formatInline(text: string): React.ReactNode {
  // Inline code `code`
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 text-amber-800 font-mono text-[11px] font-semibold border border-slate-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold **text**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return (
          <strong key={`${i}-${bIdx}`} className="font-bold text-slate-950">
            {bPart.slice(2, -2)}
          </strong>
        );
      }
      // Italic *text*
      const italicParts = bPart.split(/(\*[^*]+\*)/g);
      return italicParts.map((iPart, iIdx) => {
        if (iPart.startsWith('*') && iPart.endsWith('*') && !iPart.startsWith('**')) {
          return (
            <em key={`${i}-${bIdx}-${iIdx}`} className="italic">
              {iPart.slice(1, -1)}
            </em>
          );
        }
        return iPart;
      });
    });
  });
}
