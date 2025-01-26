import Puv from './charts/PUV';
import PiePuv from './charts/PiePUV';

function Home() {
    return (
        <div className="flex flex-col md:flex-row mt-[5%] h-full">
            <div className="w-full h-[50%]">
                <Puv />
            </div>
            <div className="w-full h-[50%]">
                <PiePuv />
            </div>
        </div>
    )
}

export default Home;
