// frontend/src/components/LexicalRichTextEditor.tsx
import { useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $getRoot,
  $createParagraphNode,
  type LexicalEditor, // ✅ correct type
} from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $setBlocksType } from "@lexical/selection";
import {
  HeadingNode,
  QuoteNode,
  $createHeadingNode,
  $createQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import {
  ListItemNode,
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";

type Props = {
  /** Initial HTML for edit mode. Loaded once on mount. */
  initialHTML?: string;
  /** Emits HTML on every change. */
  onChange: (html: string) => void;
  placeholder?: string;
};

function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const setHeading = (tag: Extract<HeadingTagType, "h1" | "h2">) => {
    editor.update(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createHeadingNode(tag));
    });
  };

  const setQuote = () => {
    editor.update(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createQuoteNode());
    });
  };

  const clearFormatting = () => {
    editor.update(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createParagraphNode());
    });
  };

  const addLink = () => {
    const url = prompt("Enter URL");
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  const Btn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 text-sm rounded border mr-2 mb-2 bg-gray-100 hover:bg-gray-200"
    >
      {label}
    </button>
  );

  return (
    <div className="mb-2 flex flex-wrap">
      <Btn label="B" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} />
      <Btn label="I" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} />
      <Btn label="U" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} />
      <Btn label="H1" onClick={() => setHeading("h1")} />
      <Btn label="H2" onClick={() => setHeading("h2")} />
      <Btn label="• List" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} />
      <Btn label="1. List" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} />
      <Btn label="Unlist" onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)} />
      <Btn label="Quote" onClick={setQuote} />
      <Btn label="Link" onClick={addLink} />
      <Btn label="Clear" onClick={clearFormatting} />
    </div>
  );
}

function HtmlOnChange({ onHtmlChange }: { onHtmlChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext(); // editor already typed as LexicalEditor
  const handle = useCallback(
    (editorState: any) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor as unknown as LexicalEditor);
        onHtmlChange(html);
      });
    },
    [editor, onHtmlChange]
  );
  return <OnChangePlugin onChange={handle} />;
}

export default function LexicalRichTextEditor({ initialHTML, onChange, placeholder }: Props) {
  const initialConfig = {
    namespace: "BlogEditor",
    onError(error: Error) {
      console.error(error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
    theme: {},
    // Load initial HTML once on init (no re-import loops)
    editorState: (editor: LexicalEditor) => {
      if (!initialHTML) return;
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHTML, "text/html");
      const root = $getRoot();
      root.clear();
      const nodes = $generateNodesFromDOM(editor, dom);
      root.append(...nodes);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <div className="bg-white border border-gray-300 rounded-lg">
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[12rem] p-3 outline-none prose max-w-none" />}
          placeholder={<div className="p-3 text-sm text-gray-400">{placeholder ?? "Write your blog..."}</div>}
          ErrorBoundary={LexicalErrorBoundary as any}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoFocusPlugin />
        <HtmlOnChange onHtmlChange={onChange} />
      </div>
    </LexicalComposer>
  );
}
