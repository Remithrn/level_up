import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { go } from '@codemirror/lang-go';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';

const CodeEditor = ({ code, setCode, language, setLanguage, handleAIAnalysis }) => {
  const handleChange = React.useCallback((value, viewUpdate) => {
    setCode(value);
  }, [setCode]);

  const handleLanguageChange = (key) => {
    setLanguage(key);
  };

  const getLanguageExtension = () => {
    switch (language) {
      case 'python':
        return python();
      case 'go':
        return go();
      case 'javascript':
      default:
        return javascript();
    }
  };

 

  return (
    <div className="w-full h-full p-6 bg-gray-900 text-white text-left">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">Select Language:</span>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="bg-gray-800 text-white hover:bg-gray-700">
                {language.charAt(0).toUpperCase() + language.slice(1)}
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Language selection"
              onAction={handleLanguageChange}
              className="bg-gray-800 text-white"
            >
              <DropdownItem key="javascript" className="hover:bg-gray-700">
                JavaScript
              </DropdownItem>
              <DropdownItem key="python" className="hover:bg-gray-700">
                Python
              </DropdownItem>
              <DropdownItem key="go" className="hover:bg-gray-700">
                Golang
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {handleAIAnalysis && (
          <Button onClick={handleAIAnalysis} className="bg-blue-500 hover:bg-blue-600 text-white">
            Analyze with AI
          </Button>
        )}
      </div>

      <CodeMirror
        value={code}
        height="400px"
        theme={dracula}
        extensions={[getLanguageExtension()]}
        onChange={handleChange}
        className="border border-gray-700 rounded-md"
      />
    </div>
  );
};

export default CodeEditor;
