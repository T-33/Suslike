import {Search, SlidersHorizontal} from "lucide-react";
import Loading from "./Loading.tsx"
import React, {useEffect, useState} from "react";
import {User} from "../types/User.ts";
import {NavLink} from "react-router-dom";

export default function SearchPage () {

    const [searchInputValue, setSearchInputValue] = useState("");
    const [foundUsers, setFoundUsers] = useState<User[] | null>(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSearchResult(searchInputValue);
    }, [searchInputValue])

    function handleSearchInput (e: React.ChangeEvent<HTMLInputElement>) {
       setSearchInputValue(e.target.value)
    }

   async function fetchSearchResult (username: string) {
        try {
            setLoading(true)
            setFoundUsers(null)
            const response = await fetch(`http://localhost:3001/api/search-users/${username}`)
            if(response.ok) {
                const foundUsers = await response.json() as User[];
                setFoundUsers(foundUsers)
            }
        } catch (e) {
            console.log(`Error searching for ${username} ${e}`)
        }
        setLoading(false)
   }

   return (
       <div className="flex justify-center size-full h-auto min-h-full">
           <div className="flex flex-col w-1/2">
               <header className="text-center font-bold">Search</header>
               <main className={`flex flex-col  h-auto min-h-full rounded-3xl bg-[#2e3440]`}>
                   <div className="flex justify-between mx-8 mt-8 py-4 px-6 bg-[#242424] rounded-2xl">
                       <Search />

                       <input className="mx-2 grow outline-none"
                              type="text"
                              placeholder="Search"
                              onInput={handleSearchInput}
                              value={searchInputValue}
                       />

                       <SlidersHorizontal />
                   </div>

                  <div className="felx flex-col h-auto self-center w-full">
                      {loading ? <Loading/> : ''}

                      {foundUsers == null ? "" :
                          foundUsers.map((user, index ) => {
                              return (

                                      <div className={`flex justify-between items-center ${index != 0 ? "border-t" : ""} border-gray-400 p-5`} key={user.username}>

                                          <img
                                              className="w-1/8 mr-4 rounded-full aspect-square  border-solid border-gray-300"
                                              src={user.profile_picture_url}
                                              alt="Background"
                                          />
                                          <div className="self-start grow h-full">
                                              <div className="font-bold">
                                                  <NavLink to={`/user/${user.username}`} key={user.username}>{user.username}</NavLink>
                                              </div>
                                              <div>
                                                  {user.description}
                                              </div>
                                          </div>
                                          <div>
                                              <button
                                                  className="bg-white text-black p-4 rounded-2xl cursor-pointer"
                                                  onClick={() => {console.log(user.username)}}
                                              >
                                                  Subscribe
                                              </button>
                                          </div>
                                      </div>
                              )
                          })
                      }
                  </div>

               </main>
           </div>
       </div>
   )
}