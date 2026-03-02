import { ReactNode } from "react";

export function IconButton({icon,onClick,activated}: {icon: ReactNode,onClick: () => void,activated: boolean}) {
    return <div className={`${activated ? "bg-white text-black" : "text-white"} m-2 p-2 rounded-full hover:bg-white hover:text-black cursor-pointer`} onClick={onClick}>
        {icon}
    </div>
}