import React, { useRef, useEffect, useCallback } from 'react';
import { FileText, Save } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onCursorChange: (position: number) => void;
  isConnected: boolean;
}

const Editor: React.FC<EditorProps> = ({ content, onChange, onCursorChange, isConnected }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (textareaRef.current && !isUpdatingRef.current) {
      const textarea = textareaRef.current;
      const cursorPosition = textarea.selectionStart;
      
      // Only update if content is different from current textarea value
      if (textarea.value !== content) {
        textarea.value = content;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  }, [content]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    isUpdatingRef.current = true;
    onChange(newContent);
    // Reset the flag after a short delay to allow for remote updates
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  }, [onChange]);

  const handleCursorChange = useCallback(() => {
    if (textareaRef.current) {
      onCursorChange(textareaRef.current.selectionStart);
    }
  }, [onCursorChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Trigger cursor position update on key events for better responsiveness
    setTimeout(handleCursorChange, 0);
  }, [handleCursorChange]);
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Collaborative Document</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Save className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
            <span className={isConnected ? 'text-green-600' : 'text-gray-500'}>
              {isConnected ? 'Live sync' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          defaultValue={content}
          onChange={handleChange}
          onSelect={handleCursorChange}
          onKeyUp={handleCursorChange}
          onKeyDown={handleKeyDown}
          onMouseUp={handleCursorChange}
          placeholder="Start typing to begin collaborating..."
          className="w-full h-full resize-none border-none outline-none text-gray-900 leading-relaxed text-base font-mono"
          style={{ minHeight: '500px' }}
        />
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Characters: {content.length}</span>
          <span>Words: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default Editor;