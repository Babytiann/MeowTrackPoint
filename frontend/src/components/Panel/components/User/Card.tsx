function Card({ item }: Readonly<{ item: UserData }>) {
    return (
        <div className="mb-5 p-5 first:mt-5
                        flex justify-between

                        bg-cardBg
                        dark:bg-cardDarkBg
                        drop-shadow-md

                        rounded-xl
                        border-e-gray-200
                        ">
            <div className="md:w-[400px] w-[200px]">
                {item.uuid}
            </div>
            <div className="w-[100px]">
                {item.browser}
            </div>
            <div className="w-[100px] md:mr-20 mr-5">
                {item.os}
            </div>
        </div>
    )
}

export default Card;