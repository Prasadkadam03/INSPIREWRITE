import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface Blog {
    "content": string;
    "title": string;
    "id": string
    "author": {
        "name": string;
        "occupation": string;
        "bio": string;
    }
    "publishedAt": string;
    "area" : string;
}

export const useUserName = () => { 
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/user`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
            setName(response.data.name || "Anonymous");
        })
        .catch(() => {
            setName("Anonymous");
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return { loading, name };
}


export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlog(response.data.blog);
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        blog
    }

}
export const useBlogs = ({ query }: { query: string }) => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk?filter=${query}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
            if (response.data.blogs.length === 0) {
                setBlogs([{ content: "", title: "No blogs available with search content", id: "", author: { name: "", occupation: "" ,bio : "" }, publishedAt: new Date().toISOString(), area: "" }]);
            } else {
                setBlogs(response.data.blogs);
            }
            setLoading(false);
        })
    }, [query])

    
    return {
        loading,
        blogs
    }
}