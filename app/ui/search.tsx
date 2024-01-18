'use client';

import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useDebouncedCallback} from "use-debounce";

export default function Search({placeholder}: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();

    /**
     Debouncing is a programming practice that limits the rate at which a function can fire. In our case, you only want
     to query the database 500ms after user has stopped typing.
     */

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        // reset pagination to 1 after user trying to search new word
        params.set('page', '1');

        if (term) params.set("query", term)
        else params.delete("query")

        replace(`${pathname}?${params.toString()}`);
    }, 500);

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(event) => {
                    handleSearch(event.target.value)
                }}
                defaultValue={searchParams.get('query')?.toString()}
            />
            {/*since you're not using state, you can use defaultValue. This means the native input will manage its own state.
                This is okay since you're saving the search query to the URL instead of state.*/}
            <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
        </div>
    );
}
