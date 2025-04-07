import { JSX } from "react";
import { useUserName } from "../hooks";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";

export const Appbar = ({ button }: { button?: JSX.Element }) => {
    const { loading, name } = useUserName();
    const navigate = useNavigate();

    return (
        <div className="border-b flex justify-between items-center px-6 py-4 bg-white shadow-md">
            <div className="flex items-center space-x-4">
                {button && (
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        {button}
                    </button>
                )}
                <Link
                    to="/blogs"
                    className="text-2xl font-bold text-red-700 hover:text-red-900 transition-colors"
                >
                    InspireWrite
                </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
                <Link to="/publish">
                    <button
                        type="button"
                        className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 transition"
                    >
                        New
                    </button>
                </Link>

                <Link to="/UpdateUser">
                    <Avatar size="big" name={loading ? "..." : name || "Guest"} />
                </Link>
            </div>
        </div>
    );
};
