import Puv from './charts/PUV';
import PiePuv from './charts/PiePUV';
import EventPUV from "./charts/EventPUV.tsx";
import Referrer from "./charts/Referrer.tsx";

function Home() {
    return (
        <div className="flex flex-col gap-10 mt-[5%] h-[1000px]">
            <div className="flex flex-col md:flex-row w-full h-full">
                <PiePuv />
                <Referrer />
            </div>
            <div className="w-full h-full">
                <Puv />
            </div>
            <div className="w-full h-full">
                <EventPUV />
            </div>
        </div>
    )
}

export default Home;
