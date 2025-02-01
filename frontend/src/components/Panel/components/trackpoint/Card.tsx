import { Button } from "antd";


function Card({ event, buttonClick }: Readonly<CardProps>) {
    return (
        <div className="mt-4 py-4 px-10

                        rounded-xl
                        border-e-gray-200

                        bg-[#FAFAFA]

                        flex
                        justify-between
                        ">
            <div>
                {event}
            </div>
            <div className="flex gap-4 justify-center items-center">
                <Button color="danger" variant="filled" onClick={() => {buttonClick(event)}}>删除</Button>
            </div>
        </div>
    );
}

export default Card;
