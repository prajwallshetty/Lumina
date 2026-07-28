"use client";

import { useRef, useEffect, useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link, Heading2, Quote, Code, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function RichTextEditor({ value = "", onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [htmlVal, setHtmlVal] = useState(value || "");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
      setHtmlVal(value || "");
    }
  }, [value]);

  const exec = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    triggerChange();
  };

  const triggerChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlVal(html);
      onChange(html);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlVal(val);
    onChange(val);
  };

  const addLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  };

  if (!isMounted) return <div className="h-40 w-full animate-pulse bg-muted rounded-md" />;

  return (
    <div className="flex flex-col rounded-lg border border-input bg-background shadow-xs focus-within:ring-2 focus-within:ring-accent/20">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-input bg-secondary/30 p-1.5 rounded-t-lg">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("bold")}
          title="Bold"
          disabled={showSource}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("italic")}
          title="Italic"
          disabled={showSource}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("underline")}
          title="Underline"
          disabled={showSource}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("formatBlock", "<h2>")}
          title="Heading 2"
          disabled={showSource}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("formatBlock", "<blockquote>")}
          title="Blockquote"
          disabled={showSource}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("insertUnorderedList")}
          title="Bullet List"
          disabled={showSource}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("insertOrderedList")}
          title="Numbered List"
          disabled={showSource}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={addLink}
          title="Insert Link"
          disabled={showSource}
        >
          <Link className="h-4 w-4" />
        </Button>
        <div className="ml-auto" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-xs font-semibold"
          onClick={() => setShowSource(!showSource)}
          title="Toggle HTML Source"
        >
          {showSource ? (
            <>
              <Eye className="h-3.5 w-3.5" /> Visual
            </>
          ) : (
            <>
              <Code className="h-3.5 w-3.5" /> HTML
            </>
          )}
        </Button>
      </div>

      {/* Editor Content Area */}
      {showSource ? (
        <textarea
          value={htmlVal}
          onChange={handleSourceChange}
          className="w-full min-h-[200px] bg-code font-mono text-sm p-4 outline-hidden border-0 rounded-b-lg resize-y focus:ring-0"
          placeholder="Enter raw HTML code..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onBlur={triggerChange}
          onInput={triggerChange}
          className="w-full min-h-[200px] max-h-[600px] overflow-y-auto p-4 outline-hidden prose prose-stone max-w-none dark:prose-invert rounded-b-lg"
          style={{ cursor: "text" }}
        />
      )}
    </div>
  );
}
