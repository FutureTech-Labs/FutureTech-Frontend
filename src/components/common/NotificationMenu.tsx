import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Notification {
    id: number;
    message: string;
    time: string;
    createdAt?: string;
}


interface NotificationMenuProps {
    notifications: Notification[];
}

const NotificationMenu = ({ notifications }: NotificationMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full md:h-10 md:w-10 w-8 h-8 button-gradient border-t-2 border-white/30 text-white hover:bg-white/10 disable-ring"
                >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 left-6 bg-red-400 text-white text-[10px] font-bold rounded-full px-[5px] py-px">
                            {notifications.length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="md:w-64 mt-2">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 px-3 py-2">No new notifications</p>
                ) : (
                    notifications.map((n) => (
                        <DropdownMenuItem
                            key={n.id}
                            className="flex items-start justify-between text-sm whitespace-normal py-2"
                        >
                            <span>{n.message}</span>
                            <span className="text-xs text-gray-400 mt-1">{n.time}</span>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>

        </DropdownMenu>
    );
};

export default NotificationMenu;
