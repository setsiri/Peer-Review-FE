import { useEffect, useState } from "react";
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange?: (code: string) => void;
  height?: string | number;
  code? : string;
}

export default function CodeEditor({
  initialCode = '// เขียนคำตอบของคุณที่นี่\n',
  language = 'python',
  onChange,
  height = '400px',
  code,
}: CodeEditorProps) {
  const [codeValue, setCodeValue] = useState<string>(initialCode);

  useEffect(() => {
    if (code) {
      setCodeValue(code)
    }
  }, [code]);

  const handleChange = (value: string | undefined) => {
    const newCode = value || '';
    setCodeValue(newCode);
    onChange?.(newCode);
  };

  return (
    <div className="h-[400px] border border-[#2a2e3f] rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        theme="vs-dark"
        value={codeValue}
        onChange={handleChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          roundedSelection: false,
          padding: { top: 16, bottom: 16 },
          cursorStyle: 'line',
        }}
      />
    </div>
  );
}
