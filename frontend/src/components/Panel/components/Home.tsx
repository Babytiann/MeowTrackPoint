import Puv from './charts/PUV';

function Home() {
    return (
        <div className="flex flex-col md:flex-row mt-[5%] h-full">
            <div className="w-full h-[50%]">
                <Puv />
            </div>

            <div className="chart w-full h-[50%]"></div>
        </div>
    )
}

export default Home;
