function Card({ item }: Readonly<{ item: ErrorData }>) {
    return (
        <div className="mb-5 p-5 first:mt-5
                        flex justify-between

                        bg-cardBg
                        drop-shadow-md

                        rounded-xl
                        border-e-gray-200

                        whitespace-nowrap
                        overflow-elipsis
                        ">
            <div className="md:w-[400px] w-[200px]">
                {item.uuid}
            </div>
            <div className="w-[100px]">
                {item.message}
            </div>
            <div className="w-[100px]">
                {item.stack}
            </div>
            <div className="w-[100px]">
                {item.type}
            </div>
            <div className="w-[100px] mr-5">
                {item.page_url}
            </div>
            <div className="w-[100px] md:mr-10 mr-5">
                {item.create_at}
            </div>
        </div>
    )
}

export default Card;