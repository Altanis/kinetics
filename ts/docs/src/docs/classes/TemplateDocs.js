import { useContext, useEffect, useState } from "react";
import CodeBlock from "../../components/CodeBlock";

export default function TemplateDocs({ data, nerdified }) {    
    const [displaySummary, setDisplaySummary] = useState(true);
    const [displayConstructor, setDisplayConstructor] = useState(true);
    const [displayMethods, setDisplayMethods] = useState(true);
    const [displayProperties, setDisplayProperties] = useState(true);

    const [summary, setSummary] = useState(data.data?.[0]);
    const [constructor, setConstructor] = useState(data.data?.[1]);
    const [properties, setProperties] = useState(data.data?.[2]);
    const [methods, setMethods] = useState(data.data?.[3]);

    useEffect(() => {
        const summary = data.data?.find(d => d.name === "Summary");
        const constructor = data.data?.find(d => d.name === "Constructor");
        const properties = data.data?.find(d => d.name === "Properties");
        const methods = data.data?.find(d => d.name === "Methods");

        setSummary(summary);
        setConstructor(constructor);
        setProperties(properties);
        setMethods(methods);

        console.log(summary, constructor, properties, methods);
    }, [data]);

    if (!data.data) return null;

    return (
        <div className="relative top-6 mx-8">
            <div className="w-full flex-col space-y-4">
                <div className="flex flex-col mb-10">
                    <h2 className="text-2xl text-white mb-4 font-bold">{data.name}</h2>
                    <CodeBlock children={data.exportStatement} language="typescript" />
                </div>

                {data.data && (<div className="flex flex-col text-white">
                    {
                        <>
                            {(summary && summary.name === "Summary") && (<div className="flex flex-col">
                                <button 
                                    className={`bg-[#222] hover:bg-[#333] duration-300 p-3 rounded-md border border-solid ${displaySummary ? "border-accent" : "border-[#f43f5e60]"}`} 
                                    onClick={() => setDisplaySummary(!displaySummary)}
                                >
                                    <div className="flex flex-row place-content-between place-items-center">
                                        <div className="flex flex-row place-items-center gap-3">
                                            <i class="fas fa-align-left text-accent"></i>
                                            Summary
                                        </div>
                                        <i className={`fas fa-chevron-down ml-2 top-0 transition-transform transform ${displaySummary && "rotate-180"}`}></i>
                                    </div>
                                </button>
                                <div className="mx-2 px-5 py-5 md:mx-6.5 md:px-4.5">
                                    {displaySummary && (
                                        <div className="flex flex-col">
                                            <p className="">
                                                {nerdified && summary.description.includes('<nerd>') ? (
                                                    summary.description.split(/(<nerd>.*<\/nerd>)/g).map(str => {
                                                        if (str.startsWith('<nerd>')) {
                                                            return (
                                                                <span className="text-yellow-500">
                                                                    {str.replaceAll('<nerd>', '').replace('</nerd>', '').split(/(`.*?`)/g).map(str => {
                                                                            if (str.startsWith('`')) {
                                                                                return (
                                                                                    <span className="font-mono bg-[#414446] px-2 rounded-md">
                                                                                        {str.replaceAll('`', '')}
                                                                                    </span>
                                                                                );
                                                                            } else {
                                                                                return str;
                                                                            }
                                                                        })}
                                                                </span>
                                                            );
                                                        } else {
                                                            return str.split(/(`.*?`)/g).map(str => {
                                                                if (str.startsWith('`')) {
                                                                    return (
                                                                        <span className="font-mono bg-[#414446] px-2 rounded-md">
                                                                            {str.replaceAll('`', '')}
                                                                        </span>
                                                                    );
                                                                } else {
                                                                    return str;
                                                                }
                                                            });
                                                        }
                                                    })
                                                ) : (
                                                    // remove content between <nerd> tags
                                                    summary.description.replaceAll(/<nerd>.*<\/nerd>/g, '').split(/(`.*?`)/g).map(str => {
                                                        if (str.startsWith('`')) {
                                                            return (
                                                                <span className="font-mono bg-[#414446] px-2 rounded-md">
                                                                    {str.replaceAll('`', '')}
                                                                </span>
                                                            );
                                                        } else {
                                                            return str;
                                                        }
                                                    })
                                                )}
                                            </p>
                                            <div class="mt-6 border-t-2 border border-solid border-[#55555560]"></div>
                                        </div>
                                    )}
                                </div>
                            </div>) }


                            {(constructor && constructor.name === "Constructor") && (<div className="flex flex-col mt-8">
                                <button 
                                    className={`bg-[#222] hover:bg-[#333] duration-300 p-3 rounded-md border border-solid ${displayConstructor ? "border-[#BC8CFF]" : "border-[#BC8CFF60]"}`} 
                                    onClick={() => setDisplayConstructor(!displayConstructor)}
                                >
                                    <div className="flex flex-row place-content-between place-items-center">
                                        <div className="flex flex-row place-items-center gap-3">
                                            <i class="fas fa-cube text-[#BC8CFF]"></i>
                                            Constructor
                                        </div>
                                        <i className={`fas fa-chevron-down ml-2 top-0 transition-transform transform ${displayConstructor && "rotate-180"}`}></i>
                                    </div>
                                </button>
                                <div className="mx-2 px-5 py-5 md:mx-6.5 md:px-4.5">
                                    {displayConstructor && (
                                        <div className="flex flex-col">
                                            <p className="font-mono">{constructor.parameters}</p>
                                            {constructor.table[0] && (<table class="w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th class="break-normal border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-accent px-3 py-2 text-left text-sm">Name</th>
                                                        <th class="break-normal border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-accent px-3 py-2 text-left text-sm">Type</th>
                                                        <th class="break-normal border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-accent px-3 py-2 text-left text-sm">Optional</th>
                                                        <th class="break-normal border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-accent px-3 py-2 text-left text-sm">Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {constructor.table.map(({ Name, Type, Optional, Description }, index) => (
                                                            <tr key={index}>
                                                                <td class="px-3 py-2 text-left text-sm font-mono rounded-full">{Name}</td>
                                                                <td class="px-3 py-2 text-left text-sm font-mono">{Type}</td>
                                                                <td class="px-3 py-2 text-left text-sm">{Optional}</td>
                                                                <td class="px-3 py-2 text-left text-sm">{Description}</td>
                                                            </tr>
                                                    ))}
                                                </tbody>
                                            </table>)}
                                            <div class="mt-6 border-t-2 border border-solid border-[#55555560]"></div>
                                        </div>
                                    )}
                                </div>
                            </div>)}

                            {(properties && properties.name === "Properties") && (<div className="flex flex-col mt-8">
                                <button
                                    className={`bg-[#222] hover:bg-[#333] duration-300 p-3 rounded-md border border-solid ${displayProperties ? "border-[#6EB1EC]" : "border-[#6EB1EC60]"}`}
                                    onClick={() => setDisplayProperties(!displayProperties)}
                                >
                                    <div className="flex flex-row place-content-between place-items-center">
                                        <div className="flex flex-row place-items-center gap-3">
                                            <i className="fas fa-wrench text-[#6EB1EC]"></i>
                                            Properties
                                        </div>
                                        <i className={`fas fa-chevron-down ml-2 top-0 transition-transform transform ${displayProperties && "rotate-180"}`}></i>
                                    </div>
                                </button>
                                <div className="mx-2 px-5 py-5 md:mx-6.5 md:px-4.5">
                                    {displayProperties && properties.data.map(({ keyword, name, returnType, defaultsTo, description, latex }, index) => (
                                        <div key={index} className="flex flex-col">
                                            <p className="font-mono">
                                                <span className="text-[#b877dbe6]">{keyword} </span>
                                                <span className="text-[#E95678E6]">{name}</span>
                                                <>: </>
                                                <span className="text-[#FFD486E6]">{returnType}</span>
                                                {defaultsTo && (
                                                    <>
                                                        <> = </>
                                                        <span className="text-[#F09483E6]">{defaultsTo}</span>
                                                    </>
                                                )}
                                            </p>
                                            {description && (
                                                <p className="mt-2">
                                                    {nerdified && description.includes('<nerd>') ? (
                                                        description.split(/(<nerd>.*<\/nerd>)/g).map(str => {
                                                            if (str.startsWith('<nerd>')) {
                                                                return (
                                                                    <span className="text-yellow-500">
                                                                        {str.replaceAll('<nerd>', '').replace('</nerd>', '').split(/(`.*?`)/g).map(str => {
                                                                            if (str.startsWith('`')) {
                                                                                return (
                                                                                    <span className="font-mono bg-[#414446] px-2 rounded-md">
                                                                                        {str.replaceAll('`', '')}
                                                                                    </span>
                                                                                );
                                                                            } else {
                                                                                return str;
                                                                            }
                                                                        })}
                                                                    </span>
                                                                );
                                                            } else {
                                                                return str;
                                                            }
                                                        })
                                                    ) : (
                                                        // remove content between <nerd> tags
                                                        description.replaceAll(/<nerd>.*<\/nerd>/g, '').split(/(`.*?`)/g).map(str => {
                                                            if (str.startsWith('`')) {
                                                                return (
                                                                    <span className="font-mono bg-[#414446] px-2 rounded-md">
                                                                        {str.replaceAll('`', '')}
                                                                    </span>
                                                                );
                                                            } else {
                                                                return str;
                                                            }
                                                        })
                                                    )}
                                                </p>
                                            )}         
                                            {nerdified && (
                                                latex?.map((l, i) => (
                                                    <img src={l} key={i} style={{ display: !latex && "none" }} className="w-1/2 mx-auto mt-4" />
                                                ))
                                            )}
                                            <div class="my-6 border-t-2 border border-solid border-[#FFFFFF30]"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>)}

                            {(methods && methods.name === "Methods") && (<div className="flex flex-col mt-8">
                                <button 
                                    className={`bg-[#222] hover:bg-[#333] duration-300 p-3 rounded-md border border-solid ${displayMethods ? "border-[#9EE43F]" : "border-[#9EE43F60]"}`} 
                                    onClick={() => setDisplayMethods(!displayMethods)}
                                >
                                    <div className="flex flex-row place-content-between place-items-center">
                                        <div className="flex flex-row place-items-center gap-3">
                                            <i class="fas fa-cogs text-lime-400"></i>
                                            Methods
                                        </div>
                                        <i className={`fas fa-chevron-down ml-2 top-0 transition-transform transform ${displayMethods && "rotate-180"}`}></i>
                                    </div>
                                </button>
                                <div className="mx-2 px-5 py-5 md:mx-6.5 md:px-4.5">
                                    {displayMethods && methods.data.map(({ keyword, name, returnType, description, latex, table }, index) => (
                                        <div key={index} className="flex flex-col">
                                            <p className="font-mono">
                                                <span className="text-[#b877dbe6]">{keyword} </span>
                                                <span className="text-[#25B0BCE6]">{name}</span>
                                                <>: </>
                                                <span className="text-[#FFD486E6]">{returnType}</span>
                                            </p>
                                            {description && (
                                                <p className="mt-2">
                                                    {nerdified && description.includes('<nerd>') ? (
                                                        description.split(/(<nerd>.*<\/nerd>)/g).map(str => {
                                                            if (str.startsWith('<nerd>')) {
                                                                return (
                                                                    <span className="text-yellow-500">
                                                                        {str.replace('<nerd>', '').replace('</nerd>', '').split(/(`.*?`)/g).map(str => {
                                                                            if (str.startsWith('`')) {
                                                                                return (
                                                                                    <span className="font-mono bg-[#414446] px-2 rounded-md">
                                                                                        {str.replaceAll('`', '')}
                                                                                    </span>
                                                                                );
                                                                            } else {
                                                                                return str;
                                                                            }
                                                                        })}
                                                                    </span>
                                                                );
                                                            } else {
                                                                return str;
                                                            }
                                                        })
                                                    ) : (
                                                        // remove content between <nerd> tags
                                                        description.replace(/<nerd>.*<\/nerd>/g, '').split(/(`.*?`)/g).map(str => {
                                                            if (str.startsWith('`')) {
                                                                return (
                                                                    <span className="font-mono bg-[#414446] px-2 rounded-md">
                                                                        {str.replaceAll('`', '')}
                                                                    </span>
                                                                );
                                                            } else {
                                                                return str;
                                                            }
                                                        })
                                                    )}
                                                </p>
                                            )}      
                                            {table?.length ? (
                                                <table class="w-full border-collapse">
                                                    <thead>
                                                        <tr>
                                                            <th class="break-normal border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-accent px-3 py-2 text-left text-sm">Name</th>
                                                            <th class="break-normal border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-accent px-3 py-2 text-left text-sm">Type</th>
                                                            <th class="break-normal border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-accent px-3 py-2 text-left text-sm">Optional</th>
                                                            <th class="break-normal border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-accent px-3 py-2 text-left text-sm">Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {table.map(({ Name, Type, Optional, Description }, index) => (
                                                            <tr key={index}>
                                                                <td class="px-3 py-2 text-left text-sm font-mono rounded-full">{Name}</td>
                                                                <td class="px-3 py-2 text-left text-sm font-mono">{Type}</td>
                                                                <td class="px-3 py-2 text-left text-sm">{Optional}</td>
                                                                <td class="px-3 py-2 text-left text-sm">{Description?.split(/(`.*?`)/g).map(str => {
                                                                    if (str.startsWith('`')) {
                                                                        return (
                                                                            <span className="font-mono bg-[#414446] px-2 rounded-md">
                                                                                {str.replaceAll('`', '')}
                                                                            </span>
                                                                        );
                                                                    } else {
                                                                        return str;
                                                                    }
                                                                }) || "No description provided."}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : null}
                                            {nerdified && (
                                                latex?.map((l, i) => (
                                                    <img src={l} key={i} style={{ display: !latex && "none" }} className="w-1/2 mx-auto mt-4" />
                                                ))
                                            )}
                                            <div class="my-6 border-t-2 border border-solid border-[#FFFFFF30]"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>)}
                        </>
                    }
                </div>)}
            </div>
        </div>
    );
};