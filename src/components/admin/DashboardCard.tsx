interface Props{

    title:string;

    value:number|string;

}

export default function DashboardCard({

title,

value

}:Props){

return(

<div className="bg-white rounded-xl shadow p-6">

<p className="text-slate-500">

{title}

</p>

<h2 className="text-4xl font-bold mt-3">

{value}

</h2>

</div>

)

}