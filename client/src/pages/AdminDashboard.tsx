// Admin Dashboard - Main page for managing products
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AddProductForm from '@/components/admin/AddProductForm';
import EditProductForm from '@/components/admin/EditProductForm';
import ProductList from '@/components/admin/ProductList';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if admin is logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast({
        title: 'Access Denied',
        description: 'Please login first',
        variant: 'destructive',
      });
      setLocation('/admin/login');
    }
  }, [setLocation, toast]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4000/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:4000/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    setLocation('/admin/login');
  };

  // Callback when product is added successfully
  const handleProductAdded = () => {
    setShowAddForm(false);
    fetchProducts(); // Refresh product list
    toast({
      title: 'Success',
      description: 'Product added successfully',
    });
  };

  // Callback when product is deleted
  const handleProductDeleted = () => {
    fetchProducts(); // Refresh product list
    toast({
      title: 'Success',
      description: 'Product deleted successfully',
    });
  };

  // Handle editing a product
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
  };

  // Callback when product is updated
  const handleProductUpdated = () => {
    setEditingProduct(null);
    fetchProducts(); // Refresh product list
    toast({
      title: 'Success',
      description: 'Product updated successfully',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your products and categories</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{products.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{categories.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full">
                {showAddForm ? 'Hide Form' : 'Add Product'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <AddProductForm 
                categories={categories}
                onSuccess={handleProductAdded}
              />
            </CardContent>
          </Card>
        )}

        {/* Edit Product Form */}
        {editingProduct && (
          <Card>
            <CardContent className="pt-6">
              <EditProductForm
                product={editingProduct}
                categories={categories}
                onProductUpdated={handleProductUpdated}
                onCancel={() => setEditingProduct(null)}
              />
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductList 
              products={products}
              onProductDeleted={handleProductDeleted}
              onProductEdit={handleEditProduct}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
