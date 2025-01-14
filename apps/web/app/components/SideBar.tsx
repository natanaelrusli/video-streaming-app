import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
}

type SideBarItemProps = {
  menuItem: MenuItem
}

const SideBarItem = ({ menuItem }: SideBarItemProps) => {
  return (
    <Link href={menuItem.href}>
      <div className="rounded-xl py-2 px-3 cursor-pointer hover:bg-gray-200 w-full">
        { menuItem.label }
      </div>
    </Link>
  )
}

const SideBar = () => {
  const menuItems: MenuItem[]  = [
    {
      href: '/',
      label: 'Home'
    },
    {
      href: '/upload',
      label: 'Upload'
    }
  ]

  return (
    <nav className="w-[250px] border-r border-gray-300 h-screen py-4 px-2 flex flex-col gap-2">
      {
        menuItems.map((item) => (
          <SideBarItem key={item.href} menuItem={item} />
        ))
      }
    </nav>
  )
}

export default SideBar