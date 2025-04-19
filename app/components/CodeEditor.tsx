import { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange?: (code: string) => void;
  height?: string | number;
}

export default function CodeEditor({
  initialCode = '// เขียนคำตอบของคุณที่นี่\n',
  language = 'python',
  onChange,
  height = '400px',
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  const handleChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onChange?.(newCode);
  };

  return (
    <div className="h-[400px] border border-[#2a2e3f] rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        theme="vs-dark"
        value={code}
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