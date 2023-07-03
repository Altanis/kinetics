import { useEffect, useState } from "react";
import CodeBlock from "../components/CodeBlock";
import "../index.css";
import { Link } from "react-router-dom";
import InstallButton from "../components/InstallButton";

export default function Home() {
    const texts = ["fastest", "easiest", "best"];
    let charIdx = 0, promptIdx = 0, deleting = false;
    
    const [text, setText] = useState("");
    
    useEffect(() => {
        const interval = setInterval(async () => {
            if (deleting) return;

            const nextChar = texts[promptIdx][charIdx];
            setText(prevText => prevText + nextChar);
            charIdx++;
            
            if (charIdx === texts[promptIdx].length) {
                const nextPromptIdx = ++promptIdx;
                if (nextPromptIdx === texts.length) return clearInterval(interval);
                
                deleting = true;
                await new Promise(resolve => setTimeout(resolve, 500));

                const deleteInterval = setInterval(() => {
                    setText(prevText => prevText.slice(0, -1));
                    charIdx--;

                    if (charIdx === 0) {
                        deleting = false;
                        setText("");

                        clearInterval(deleteInterval);
                    };
                }, 50);
            }
        }, 50);
        
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="mx-auto max-w-6xl flex flex-col place-items-center gap-24 px-8 pb-16 pt-12 min-h-screen place-content-center py-10 z-40">
            <div className="flex flex-col place-items-center gap-10 flex-row gap-6">
                <div className="flex flex-col place-items-center gap-10 text-center">
                    <h1 className="text-slate-400 text-[5.125rem] font-bold leading-tight">
                        The 
                        <span className="relative rounded bg-accent mx-3 my-1 text-white">{text}</span>
                        way to simulate 2D physics.
                    </h1>

                    <p className="my-6 text-slate-400 text-xl">
                        Kinetics.ts is a powerful NPM library that offers a versatile 2D physics engine for both server-side and web-based environments.
                        With its realistic collision detection and powerful entity handling, developers can create realistic games, educational simulations,
                        and interactive data visualizations with ease. Its extensive functionality and ease of use make it an invaluble tool for building
                        immersive experiences across multiple domains. 
                    </p>

                    <div className="flex gap-4 md:flex-row">
                        <Link to="/docs" className="bg-accent hover:bg-rose-600 duration-300 text-white font-bold py-2 px-4 rounded">
                            Get Started
                        </Link>

                        <Link to="https://github.com/Altanis/kinetics-ts" className="bg-slate-400 hover:bg-slate-500 duration-300 text-white font-bold py-2 px-4 rounded">
                            GitHub
                        </Link>
                    </div>

                    <InstallButton />
                </div>
            </div>
        </div>
    );
};