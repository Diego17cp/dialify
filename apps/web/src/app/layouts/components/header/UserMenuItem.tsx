import { Link } from "react-router"

interface Props {
    to: string;
    label: string;
    icon: React.ReactNode;
}

export const UserMenuItem = ({ to, label, icon }: Props) => {
    return (
        <Link 
            to={to}
            className="flex items-center rounded-md px-4 py-2 hover:bg-primary/30 transition-all duration-300 ease-in hover:text-accent-light"
        >
            {icon}
            <span className="ml-3">{label}</span>
        </Link>
    )
}