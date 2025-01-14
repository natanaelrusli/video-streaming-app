import SearchBar from "./SearchBar"

const NavBar = () => {
  return (
    <nav className="w-full h-16 flex items-center justify-between px-12 text-black border-b border-gray-300">
      <div className="w-full flex items-center justify-between max-w-[1920px] mx-auto">
        <div>
          <h1>YouTube</h1>
        </div>

        <div className="flex justify-center w-1/3">
          <SearchBar />
        </div>

        <div className="w-[150px]">
          <button>Upload new Video</button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar