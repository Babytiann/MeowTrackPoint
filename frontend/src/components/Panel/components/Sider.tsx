import { NavLink } from "react-router";
import avatar from "../../../assets/avatar.jpg";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {useRef, useState} from "react";

gsap.registerPlugin(useGSAP);

interface SiderProps {
    readonly brightMode: boolean;
}

function Sider({ brightMode }: SiderProps) {
    const [navClicked,setNavClicked] = useState(false);
    const [navSmall, setNavSmall] = useState(false);

    function handelClick() {
        setNavSmall(navSmall => !navSmall);
    }

    const arrow = useRef<HTMLDivElement>(null)

    return (
        <div className="relative">
            <input type={"checkbox"} className="absolute cursor-pointer
                                                opacity-0

                                                hidden
                                                sm:block

                                                size-6
                                                z-10

                                                top-[58px]
                                                right-1

                                                peer" onChange={handelClick}/>

        <div className="flex flex-col w-[108px] lg:w-[308px] h-[100vh] relative duration-300 peer-checked:w-[108px] en">
            <div className="flex basis-[15%] justify-center items-center text-center">

                {/* 头像*/}
                <div className="w-12 rounded-full overflow-hidden">
                    <img src ={avatar} alt="An avatar" className="object-contain"/>
                </div>

                <div className={`${navSmall ? 'hidden' : 'block'}`}>
                     <a href="https://gemdzqq.com" target="_blank" className="text-5xl font-bold hidden lg:block">Meow</a>
                </div>

                {/*箭头图标*/}
                <div className="absolute right-0

                                size-8 rounded-lg

                                flex items-center justify-center

                                invisible
                                lg:visible

                                cursor-pointer
                                " ref={arrow}>
                    {(brightMode) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd" />
                        </svg>)
                    }
                </div>
            </div>

            <div className="pl-[20%]">
                <div className="accent-gray-300 opacity-40">Menu</div>
                <hr className="border-t border-gray-300 my-2 w-[70%]"/>
            </div>

            <div className="flex flex-col gap-10 pt-5 relative text-xl">
                <div className="lg:pl-[40%] flex justify-center lg:justify-start">
                    <NavLink to={"/"} className={({ isActive}) =>
                        (isActive && navClicked) ? "text-rose-200" : "text-black dark:text-white"}
                        onClick={() => {setNavClicked(true)}}>
                        <div className="flex items-center gap-2 duration-200 hover:text-rose-200">
                        {brightMode ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-6"
                            >
                                <path
                                    d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"/>
                                <path
                                    d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"/>
                            </svg>
                        )}
                            <div className={`${navSmall ? 'hidden' : 'block'}`}>
                                <span className="hidden lg:block ">Home</span>
                            </div>
                        </div>
                    </NavLink>
                </div>
                <div className="lg:pl-[40%] flex justify-center lg:justify-start">
                    <NavLink to={"/userlist"} className={({ isActive }) =>
                        isActive ? "text-rose-200" : "text-black dark:text-white"}>
                        <div className="flex items-center gap-2 hover:text-rose-200 duration-200">
                        {brightMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd"/>
                            </svg>
                        )}
                            <div className={`${navSmall ? 'hidden' : 'block'}`}>
                                <span className="hidden lg:block">User</span>
                            </div>
                        </div>
                    </NavLink>
                </div>
                <div className="lg:pl-[40%] flex justify-center lg:justify-start">
                    <NavLink to={"/error"} className={({ isActive }) =>
                        isActive ? "text-rose-200" : "text-black dark:text-white"}>
                        <div className="flex items-center gap-2 hover:text-rose-200 duration-200">
                            {brightMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                </svg>
                            )}
                            <div className={`${navSmall ? 'hidden' : 'block'}`}>
                                <span className="hidden lg:block">Error</span>
                            </div>
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Sider;