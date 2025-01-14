import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import VideoGrid from './components/VideoGrid';

export default function Home() {
  return (
    <div className='max-h-screen overflow-y-hidden'>
      <NavBar />
      <div className='flex'>
        <SideBar />
        <main className='p-6 max-h-screen overflow-scroll w-full pb-[100px] max-w-[1920px] mx-auto'>
          <VideoGrid />
        </main>
      </div>
    </div>
  )
}
