function Card({ item }: Readonly<{ item: UserData }>) {
    return (
        <div className="mb-5 p-5 first:mt-5
                        flex justify-between

                        bg-cardBg
                        drop-shadow-md

                        rounded-xl
                        border-e-gray-200
                        ">
            <div className="w-[500px]">
                {item.uuid}
            </div>
            <div className="w-[100px]">
                {item.browser}
            </div>
            <div className="w-[100px] mr-20">
                {item.os}
            </div>
        </div>
    )
}

export default Card;