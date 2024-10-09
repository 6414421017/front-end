import Link from "next/link"
export default function Navbar() {
    const menus = [
        { name: "home", url: "/" },
        { name: "category", url: "/category" },
        { name: "transaction", url: "/transaction/income" },
    ]

    return (
        <nav className="mx-auto py-3 w-[70%] bg-stone-900 mb-5 rounded-b-md">
          <div className="flex justify-center  items-center gap-4 font-bold text-xl uppercase">
                {menus.map((item, index) => (
                <Link key={index} href={item.url} className="text-stone-400 hover:text-white">{item.name}</Link>
                ))}
          
          </div>
        </nav>
    )
}