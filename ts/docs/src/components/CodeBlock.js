import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { useEffect, useRef } from 'react';

import "./CodeBlock.css";

export default function CodeBlock({ children, language }) {
    const codeRef = useRef(null);

    useEffect(() => {
        hljs.highlightBlock(codeRef.current);
    }, [children, language]);

    return (
        <div className="relative">
            <pre>
                <code ref={codeRef} className={`hljs ${language}`}>
                    {typeof children === "string" ? children.trim() : children}
                </code>
            </pre>
        </div>
    );
};