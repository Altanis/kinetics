import { Fragment, useContext, useState } from "react";

import { Link } from "react-router-dom";


import nerd from "../static/nerd.svg";

export default function Hierarchy({ folders, nerdified: {nerdified, setNerdified} }) {

    return (
        <>
            <div className="flex items-center m-8 p-4 border border-solid border-[#FFFFFF30] rounded-md">
                {folders.map((folder, idx) => {
                    return (
                        <Fragment key={idx}>
                            <Link to={folder.link}>
                                <div className="px-4 flex md:items-center md:space-x-2 text-accent duration-200 hover:text-white hover:bg-accent hover:cursor-pointer rounded-full">
                                    <div className="text-xl">
                                        {folder.name}
                                    </div>
                                </div>
                            </Link>
                            {idx !== folders.length - 1 && <div className="text-xl text-white">{"→"}</div>}
                        </Fragment>
                    );
                })}
                <div className="text-xl ml-auto">
                    <div 
                        className={
                            `relative inline-block w-12 h-6 ${nerdified ? "bg-yellow-500" : "bg-gray-300"} duration-500 rounded-full hover:cursor-pointer`
                        }
                        onClick={() => setNerdified(!nerdified)}
                    >
                        <button
                            className={`absolute left-0 top-0 w-6 h-6 border-none rounded-full transition-transform duration-300 ease-in-out transform ${
                                nerdified && "translate-x-full"
                            }`}
                        >
                            {nerdified ? (
                                <img className={`${nerdified ? "grayscale-0" : "grayscale"} duration-500 select-none`} src={nerd} alt="nerd" width={25} height={25} />
                            ) : (
                                <img className={`${nerdified ? "grayscale-0" : "grayscale"} duration-500 select-none`} src={nerd} alt="nerd" width={25} height={25} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};