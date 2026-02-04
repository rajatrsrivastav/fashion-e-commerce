import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, Upload } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

interface EditProductFormProps {
  product: Product;
  categories: Category[];
  onProductUpdated: () => void;
  onCancel: () => void;
}

export default function EditProductForm({ product, categories, onProductUpdated, onCancel }: EditProductFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock: product.stock.toString(),
    categoryId: product.category.id.toString(),
  });
  const [images, setImages] = useState<string[]>(product.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (files: FileList) => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        toast({
          title: 'Upload Failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
      }
    }

    if (uploadedUrls.length > 0) {
      setImages(prev => [...prev, ...uploadedUrls]);
      setNewImages(prev => [...prev, ...Array.from(files)]);
      toast({
        title: 'Images Uploaded',
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          images: images,
          stock: formData.stock,
          categoryId: formData.categoryId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
        onProductUpdated();
        onCancel();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update product',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Edit Product</h2>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="edit-name">Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="edit-description">Description *</Label>
          <Textarea
            id="edit-description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-price">Price (₹) *</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-stock">Stock *</Label>
            <Input
              id="edit-stock"
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="edit-category">Category *</Label>
          <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Images (at least 3 required)</Label>
          <div className="mt-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              className="hidden"
              id="edit-image-upload"
            />
            <Label htmlFor="edit-image-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload additional images</p>
              </div>
            </Label>
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {images.length < 3 && (
            <p className="text-sm text-red-500 mt-2">
              Please add at least {3 - images.length} more image(s)
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading || images.length < 3} className="flex-1">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Product
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}