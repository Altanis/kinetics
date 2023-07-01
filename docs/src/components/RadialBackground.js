import Background from "../static/radial.svg";

export default function RadialBackground({ children }) {
    return (
        <>
            <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none overflow-hidden">
                <div className="w-[108rem] flex-none flex justify-end blur-[8rem]">
                    <img src={Background} alt="Radial Background" />
                </div>
            </div>

            {children}
        </>
    );
};