import { useTheme } from "../../../../hooks/use-theme";
import { Bell, ChevronsLeft, Moon, Search, Sun, LogOut } from "lucide-react";

import * as Popover from "@radix-ui/react-popover";
import profileImg from "@/assets/profile-image.jpg";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { handleLogout } from "../../../../view/auth/logout";


export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const profile = useSelector((state) => state.infor) || {};
    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-300"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                    />
                </div>
            </div>
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun size={20} className="dark:hidden" />
                    <Moon size={20} className="hidden dark:block" />
                </button>
                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>

                {/* Avatar Popover */}
                <Popover.Root>
                    <Popover.Trigger asChild>
                        <button className="size-10 overflow-hidden rounded-full">
                            <img
                                src={profile.avatar || profileImg}
                                alt="profile image"
                                className="size-full object-cover"
                            />
                        </button>

                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content
                            sideOffset={8}
                            className="rounded-lg border border-gray-200 bg-white dark:bg-slate-800 shadow-xl p-2 w-[140px] z-50"
                        >
                            <button
                                onClick={() => handleLogout()}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400"
                            >
                                <LogOut size={16} />
                                Đăng xuất
                            </button>
                            <Popover.Arrow className="fill-white dark:fill-slate-800" />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
