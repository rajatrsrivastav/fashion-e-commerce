// Component to display and manage list of products
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: {
    name: string;
  };
}

interface ProductListProps {
  products: Product[];
  onProductDeleted: () => void;
  onProductEdit: (product: Product) => void;
}

export default function ProductList({ products, onProductDeleted, onProductEdit }: ProductListProps) {
  // Handle delete product
  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`http://localhost:4000/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onProductDeleted();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No products yet. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <img
              src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150?text=No+Image'}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
              }}
            />

            {/* Product Details */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onProductEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 mt-3 text-sm">
                <span className="font-semibold text-green-600">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-gray-600">
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
