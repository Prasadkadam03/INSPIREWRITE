import React, { useState } from 'react';

export const SearchBar = () => {
    
    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };


    return (
        <div className='flex justify-between'>
            <input onChange={e => {
                handleInputChange(e)
            }} type="text" placeholder="Search Here...." className="w-full px-2 py-1 border rounded border-slate-200"></input>
            <button className="w-1/6 px-2 py-1 border rounded border-slate-200 hover:bg-slate-200">Search🔍</button>
        </div>
    )
};
