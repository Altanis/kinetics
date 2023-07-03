import { Fragment, useEffect, useState } from "react";
import Hierarchy from "../components/Hierarchy";
import Structure from "./Structure";
import { Link, useLocation } from "react-router-dom";

import Introduction from "./classes/Introduction";
import NotFound from "./classes/NotFound";
import TemplateDocs from "./classes/TemplateDocs";
import Demo from "./classes/Demo";

function RecursiveChildren({ children, name }) {
    if (!children || children.length === 0) return null;
  
    return (
        <ul className="flex flex-col ml-4">
            {
                children.map((child, idx) => (
                    (<li key={idx} className={`text-left text-sm font-semibold`}>
                        <Link to={child.link}>
                            <a 
                                className={`border-l border-r-0 border-t-0 border-b-0 border-solid border-[#999] ml-5 flex flex-col p-[5px] pl-6 ${child.name !== name && "hover:bg-[#FFFFFF30]"} duration-300 ${child.name === name ? "bg-accent text-white" : "text-white"}`}
                            >
                                {child.name}
                            </a>
                        </Link>
                        <RecursiveChildren children={child.children} />
                    </li>)
                ))
            }
        </ul>
    );
};

const flattenedStructure = [];

function recursivePossibleClasses(acc, section) {
    section.children.forEach(child => {
        flattenedStructure.push(child);
        acc.push(child.name.toLowerCase());

        if (child.children) {
            recursivePossibleClasses(acc, child);
        }
    });
    return acc;
};

const possibleClasses = Structure.reduce((acc, section) => {
    flattenedStructure.push(section);
    acc.push(section.name.toLowerCase());

    if (section.children) acc = recursivePossibleClasses(acc, section);    
    return acc;
}, []);

const URLMappings = new Map([
    ["docs", Introduction],
    ["notfound", NotFound],
    ["demo", Demo]
]);

for (let i = 0; i < possibleClasses.length; i++) {
    if (possibleClasses[i] === "demo") continue;
    URLMappings.set(possibleClasses[i], TemplateDocs);
};

export default function Docs() {
    const location = useLocation();

    const [displayHome, setDisplayHome] = useState(true);
    const [displayClasses, setDisplayClasses] = useState(false);
    const [displayTypings, setDisplayTypings] = useState(false);
    const [nerdified, setNerdified] = useState(false);

    const [DocumentationComponent, setDocumentationComponent] = useState("docs");
    let currentFolder = {};

    useEffect(() => {
        const lastSlash = location.pathname.lastIndexOf("/");
        const url = location.pathname.substring(lastSlash + 1) || "docs";
        console.log(url.toLowerCase());
        setDocumentationComponent(url.toLowerCase());
    }, [location]);

    console.log(URLMappings.get(DocumentationComponent));
    const RenderComponent = URLMappings.get(DocumentationComponent) || NotFound;

    const folders = [
        {
            name: "Home",
            link: "/"
        },
        {
            name: "Introduction",
            link: "/docs"
        }
    ];

    for (let i = 1; i < location.pathname.split("/").length; i++) {
        let folder = location.pathname.split("/")[i];
        folder = folder.charAt(0).toUpperCase() + folder.slice(1);
        if (!possibleClasses.includes(folder.toLowerCase())) {
            currentFolder = folder.toLowerCase() === "docs" && { name: "Introduction", component: Introduction };

            if (folder.toLowerCase() === "docs") continue;
            if (DocumentationComponent !== "notfound") setDocumentationComponent("notfound");
            break;
        };

        folders.push({
            name: folder,
            link: `/${location.pathname.split("/").slice(1, i + 1).join("/")}`
        });
        currentFolder = folder.toLowerCase() === "docs" ? 
            { name: "Introduction", component: Introduction } :
            flattenedStructure.find(structure => structure.name === folder);
    }

    return (
        <>
            <Hierarchy folders={folders} nerdified={{nerdified, setNerdified}} />
            <div className="relative top-2.5 mx-auto max-w-7xl gap-6 max-w-full flex">
                <div className="top-23 sticky max-w-xs min-w-xs w-full h-[calc(100vh-_145px)]">
                        <nav 
                            className="sticky mx-8 rounded-md border border-solid border-[#FFFFFF30] block h-full w-full overflow-x-visible overflow-y-auto"
                            style={{ scrollbarWidth: "unset" }}
                        >
                            <div className="flex flex-col gap-3 p-3">
                                <div className="flex flex-col">                                 
                                    {
                                        Structure.map((section, idx) => {
                                            return (
                                                <Fragment key={idx}>
                                                    <button 
                                                        className="bg-accent rounded m-3 p-3 outline-none border-none text-white text-left text-lg font-semibold hover:bg-rose-600 duration-300"
                                                        onClick={() => section.name === "Classes" ? setDisplayClasses(!displayClasses) : (section.name === "Home" ? setDisplayHome(!displayHome) : setDisplayTypings(!displayTypings))}
                                                    >
                                                        <i className="fas fa-sitemap mr-2"></i>
                                                        {section.name}
                                                        <i className={`fas fa-chevron-down ml-2 top-0 right-0 transition-transform transform ${section.name === "Classes" ? (displayClasses && "rotate-180") : (section.name === "Home" ? (displayHome && "rotate-180") : (displayTypings && "rotate-180"))}`}></i>
                                                    </button>
                                                    {(section.name === "Classes" ? displayClasses : (section.name === "Home" ? displayHome : displayTypings)) ? <div>
                                                        <RecursiveChildren children={section.children} name={currentFolder?.name} />
                                                    </div> : null}
                                                </Fragment>
                                            );
                                        })
                                    }
                                </div>
                        </div>
                    </nav>
                </div>
                <div className={`mx-5 ${DocumentationComponent !== "docs" && "mx-auto max-w-5xl"} min-w-xs w-full pb-10 overflow-y-auto`} style={{ maxHeight: "calc(100vh - 145px)" }}>
                    <RenderComponent data={currentFolder} nerdified={nerdified} />
                </div>
            </div>
        </>   
    );
};