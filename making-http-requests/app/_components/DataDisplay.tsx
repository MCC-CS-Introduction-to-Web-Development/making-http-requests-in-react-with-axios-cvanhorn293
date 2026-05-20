"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Album {
    userId: number;
    id: number;
    title: string;
}

interface AlbumFormData {
    userId: number;
    title: string;
}

const albumSchema = yup.object().shape({
    userId: yup.number().typeError("User ID must be a number").positive("User ID must be positive").integer("User ID must be an integer").required("User ID is required"),
    title: yup.string().required("Album title is required").min(3, "Album title must be at least 3 characters").max(100, "Album title must not exceed 100 characters"),
});

const TableSkeleton = () => {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">User</th>
                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Album Title</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[...Array(20)].map((_, index) => (
                            <tr key={index} className="animate-pulse">
                                <td className="px-8 py-4">
                                    <div className="h-4 bg-slate-200 rounded w-4"></div>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="h-4 bg-slate-200 rounded w-full max-w-md"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function DataDisplay() {
    const [data, setData] = useState<Album[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AlbumFormData>({
        resolver: yupResolver(albumSchema),
    });

    useEffect(() => {
        axios
            .get("https://jsonplaceholder.typicode.com/albums")
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleAddAlbum = (formData: AlbumFormData) => {
        if (!data) return;

        const newId = Math.max(...data.map((album) => album.id)) + 1;
        const newAlbum: Album = {
            id: newId,
            userId: formData.userId,
            title: formData.title,
        };

        setData([...data, newAlbum]);
        reset();
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600 font-medium">Error: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Album</h2>
                    <form onSubmit={handleSubmit(handleAddAlbum)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="userId" className="block text-sm font-semibold text-slate-700 tracking-wide">
                                    User ID
                                </label>
                                <input
                                    type="number"
                                    id="userId"
                                    {...register("userId")}
                                    className={`w-full px-4 py-3 border-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.userId ? "border-red-400 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500"}`}
                                    placeholder="Example: 1"
                                />
                                {errors.userId && <p className="text-red-600 text-sm font-medium mt-1">{errors.userId.message}</p>}
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 tracking-wide">
                                    Album Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    {...register("title")}
                                    className={`w-full px-4 py-3 border-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.title ? "border-red-400 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300 focus:border-blue-500"}`}
                                    placeholder="Example: This is a fricken title"
                                />
                                {errors.title && <p className="text-red-600 text-sm font-medium mt-1">{errors.title.message}</p>}
                            </div>
                        </div>
                        <button type="submit" className="w-full md:w-auto cursor-pointer px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                            Add Album
                        </button>
                    </form>
                </div>

                {loading ? (
                    <TableSkeleton />
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/50">
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">User</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Album Title</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data &&
                                        data.map((album) => (
                                            <tr key={album.id} className="transition-all hover:bg-blue-50/60 group">
                                                <td className="px-8 py-4 text-sm font-bold text-blue-600 group-hover:text-blue-700">{album.id}</td>
                                                <td className="px-8 py-4 text-sm font-semibold text-slate-700">{album.userId}</td>
                                                <td className="px-8 py-4 text-sm font-medium text-slate-800 group-hover:text-slate-900">{album.title}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
