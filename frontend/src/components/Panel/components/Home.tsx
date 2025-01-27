import Puv from './charts/PUV';
import PiePuv from './charts/PiePUV';
import EventPUV from "./charts/EventPUV.tsx";

function Home() {
    return (
        <>
            <div className="flex flex-col md:flex-row mt-[5%] h-full">
                <div className="w-full h-full">
                    <Puv />
                </div>
                <div className="w-full h-full">
                    <PiePuv />
                </div>
            </div>
            <div className="flex flex-col md:flex-row mt-[5%]  h-full ">
                <div className="w-full h-full">
                    <EventPUV />
                </div>
            </div>
        </>
    )
}

export default Home;
