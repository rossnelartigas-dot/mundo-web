import DashboardCard from "@/components/admin/DashboardCard";

export default function Dashboard(){

return(

<div>

<h1 className="text-3xl font-bold mb-8">

Dashboard

</h1>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

<DashboardCard
title="Productos"
value={0}
/>

<DashboardCard
title="Pedidos"
value={0}
/>

<DashboardCard
title="Clientes"
value={0}
/>

<DashboardCard
title="Ventas"
value="$0"
/>

</div>

</div>

)

}