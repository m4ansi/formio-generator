import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

interface RightPanelProps {
  jsonData: any;
  validation: {
    fieldsMapped: number;
    errors: number;
    warnings: number;
  };
}

export function RightPanel({ jsonData, validation }: RightPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonString = JSON.stringify(jsonData, null, 2);

  return (
    <div className="h-full bg-[#1a1a2e] flex flex-col">
      {/* JSON Preview Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div>
            <h2 className="text-white flex items-center gap-2">
              <code className="text-blue-400">&lt;/&gt;</code>
              Live JSON Preview
            </h2>
            <p className="text-xs text-gray-400 mt-1">Updates in real-time</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <pre className="text-sm font-mono">
            <code className="text-gray-300">
              {jsonString.split('\n').map((line, i) => {
                let coloredLine = line;
                
                // Color syntax highlighting
                coloredLine = coloredLine
                  .replace(/"([^"]+)":/g, '<span class="text-blue-300">"$1"</span>:')
                  .replace(/: "([^"]+)"/g, ': <span class="text-green-300">"$1"</span>')
                  .replace(/: (\d+)/g, ': <span class="text-yellow-300">$1</span>')
                  .replace(/: (true|false)/g, ': <span class="text-purple-300">$1</span>')
                  .replace(/\[|\]/g, '<span class="text-gray-400">$&</span>')
                  .replace(/{|}/g, '<span class="text-gray-400">$&</span>');
                
                return (
                  <div key={i} dangerouslySetInnerHTML={{ __html: coloredLine }} />
                );
              })}
            </code>
          </pre>
        </div>
      </div>

      {/* Validation Section */}
      <div className="border-t border-gray-700 bg-[#16162a]">
        <div className="px-6 py-4">
          <h3 className="text-white text-sm mb-2">Validation</h3>
          <p className="text-xs text-gray-400 mb-4">
            {validation.errors > 0 || validation.warnings > 0
              ? 'Fix errors to continue'
              : 'All checks passed'}
          </p>
          
          <div className="bg-gray-700 rounded-lg p-4 flex justify-around">
            <div className="text-center">
              <div className="text-2xl mb-1 text-gray-400">
                {validation.fieldsMapped}
              </div>
              <div className="text-xs text-gray-400">Fields Mapped</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl mb-1 ${validation.errors > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {validation.errors}
              </div>
              <div className="text-xs text-gray-400">Errors</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl mb-1 ${validation.warnings > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {validation.warnings}
              </div>
              <div className="text-xs text-gray-400">Warnings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
