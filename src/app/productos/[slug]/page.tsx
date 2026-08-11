import { notFound } from "next/navigation";

import { getProductBySlug } from "@/services/productService";
import ProductDetails from "@/components/ProductDetails";

interface Props {
params: Promise<{
slug: string;
}>;
}

export default async function ProductPage({
params,
}: Props) {
const { slug } = await params;

const product = await getProductBySlug(slug);

if (!product) {
notFound();
}

return <ProductDetails product={product} />;
}
