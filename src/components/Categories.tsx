import {
  Monitor,
  Laptop,
  Cpu,
  Gamepad2,
  HardDrive,
  Router,
} from "lucide-react";

const categories = [
  { name: "Monitores", icon: Monitor },
  { name: "Laptops", icon: Laptop },
  { name: "Computadoras", icon: Cpu },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Almacenamiento", icon: HardDrive },
  { name: "Redes", icon: Router },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-slate-800 mb-10">
        Categorías
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <div
              key={category.name}
              className="bg-white rounded-xl shadow hover:shadow-xl transition p-6 flex flex-col items-center cursor-pointer"
            >
              <Icon size={42} className="text-cyan-500 mb-4" />
              <h3 className="font-semibold">{category.name}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}