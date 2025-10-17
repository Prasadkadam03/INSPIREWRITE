import { JSX, useState } from "react";
import { useUserName } from "../hooks";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, PlusCircle } from "lucide-react";

export const Appbar = ({ button }: { button?: JSX.Element }) => {
    const { loading, name } = useUserName();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="mb-12">
            <header className="border px-5 rounded-full border-gray-100 bg-gray-100/50 backdrop-blur-sm fixed top-2  w-full z-10">
                <div className="flex justify-between items-center px-4 py-3 md:px-6 md:py-4 max-w-screen-2xl mx-auto">
                    {/* Left Section */}
                    <div className="flex items-center space-x-4">
                        {button && (
                            <button
                                onClick={() => navigate(-1)}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                                aria-label="Go Back"
                            >
                                {button}
                            </button>
                        )}
                        <Link
                            to="/blogs"
                            className="text-xl font-bold text-red-700 hover:text-red-900 transition-colors md:text-2xl"
                        >
                            InspireWrite
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Desktop Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/publish">
                                <button
                                    type="button"
                                    className="flex items-center space-x-2 text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1.5 md:px-4 md:py-2 transition"
                                >
                                    <PlusCircle size={16} />
                                    <span>New</span>
                                </button>
                            </Link>
                            <Link to="/UpdateUser">
                                <Avatar size="small" name={loading ? "..." : name || "Guest"} />
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-600 hover:text-gray-800"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden  shadow-md border-t  border-gray-100 bg-gray-100/50 backdrop-blur-smrounded-md">
                        <nav className="flex flex-col space-y-2 px-4 py-3">
                            <Link
                                to="/publish"
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                <PlusCircle size={16} />
                                <span>New Blog</span>
                            </Link>
                            <Link
                                to="/UpdateUser"
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                <Avatar size="small" name={loading ? "..." : name || "Guest"} />
                                <span>Profile</span>
                            </Link>
                        </nav>
                    </div>
                )}
            </header>
        </div>
    );
};
