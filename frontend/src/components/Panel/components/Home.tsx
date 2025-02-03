import Puv from './charts/PUV';
import PiePuv from './charts/PiePUV';
import EventPUV from "./charts/EventPUV.tsx";
import Referrer from "./charts/Referrer.tsx";
import Timing from "./charts/Timing.tsx";

function Home({ events }: Readonly<HomeProps>) {
    return (
        <div className="flex flex-col gap-10 mt-[5%] h-[1300px]">
            <div className="flex flex-col md:flex-row w-full h-3/4">
                <Referrer />
                <PiePuv />
            </div>
            <div className="flex flex-col md:flex-row w-full h-full">
                <div className="w-full h-full">
                    <Puv />
                </div>
                <div className="w-full h-full">
                    <EventPUV events={events} />
                </div>
            </div>

            <div className="w-full h-1/2 md:h-full">
                <Timing events={events} />
            </div>
        </div>
    )
}

export default Home;
