import Iframe from "react-iframe";

export default function Demo() {
    console.log(process.env);
    return (
        // <canvas style={{
        //     width: "1000px",
        //     height: "800px",
        //     top: 0,
        //     left: 0,
        //     zIndex: 999,
        // }}></canvas>
        <Iframe src="https://physics-engine-demo.vercel.app/" height="800" width="1000"></Iframe>
    );
};
