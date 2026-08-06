export default function Header() {

    return (

        <header className="bg-white shadow h-20 flex items-center justify-between px-8">

            <h1 className="text-2xl font-bold">

                Panel Administrativo

            </h1>

            <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-full bg-cyan-500"></div>

                <span>

                    Administrador

                </span>

            </div>

        </header>

    );

}