import { Product } from "@/types/Product";
import { getProductById } from "@/lib/api";
import ProductForm from "@/components/ui/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = await params;
  const product: Product | null = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondaryBeige to-secondaryBeige/50 p-3 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <p className="text-lg text-primaryBrown/70">Product not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return <ProductForm product={product} mode="edit" />;
};

export default EditProductPage;
