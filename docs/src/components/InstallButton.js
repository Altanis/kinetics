import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

// export function InstallButton() {
// 	const [interacted, setInteracted] = useState(false);
// 	const [state, copyToClipboard] = useCopyToClipboard();

// 	useEffect(() => {
// 		const timer = setTimeout(() => setInteracted(false), 2000);
// 		return () => clearTimeout(timer);
// 	}, [interacted]);

// 	return (
// 		<button
// 			className="h-11 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center rounded px-6 text-base font-semibold leading-none text-white no-underline outline-none active:translate-y-px focus:ring focus:ring-width-2 focus:ring-white gap-2 bg-white text-gray-800 border-gray-400 border border-solidborder-solidborder-light-900 text-black transition duration-200 active:translate-y-px dark:border-dark-100 hover:border-black active:bg-light-300 dark:bg-dark-400 hover:bg-light-200 dark:text-white focus:ring focus:ring-width-2 focus:ring-blurple dark:active:bg-dark-200 dark:hover:bg-dark-300 cursor-copy font-mono"
// 			onClick={() => {
// 				setInteracted(true);
// 				copyToClipboard('npm install kinetics.ts');
// 			}}
// 			type="button"
// 		>
// 			<span className="font-semibold text-accent">{'>'}</span> npm install kinetics.ts&nbsp;
// 			{state.value && interacted ? (
// 				<i className="fas fa-check ml-1 inline-block text-green-500" />
// 			) : (
// 				<i className="fas fa-copy ml-1 inline-block" />
// 			)}
// 		</button>
// 	);
// }

export default function InstallButton() {
    const [copied, setCopied] = useState(false);
    function ChangeBackgroundColor() {
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    return (
        <CopyToClipboard text={"npm install kinetics.ts"} onCopy={ChangeBackgroundColor}>
            <div 
                className="flex flex-row place-items-center text-white bg-[#222222] border  border-solid border-[#3C3C3C] hover:border-transparent hover:bg-[#444444] duration-300 rounded px-3 py-3 cursor-copy font-mono"
                style={{fontFamily: "JetBrains Mono"}}
            >
                <span className="font-semibold text-accent">
                    {"> "} &nbsp;    
                </span> 
                {"npm install kinetics.ts"}&nbsp;
                {copied ? (
                    <i className="fas fa-check ml-1 inline-block text-green-500"></i>
                ) : (
                    <i className="fas fa-copy ml-1 inline-block"></i>
                )}
            </div>
        </CopyToClipboard>
    );
}