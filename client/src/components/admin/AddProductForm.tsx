// Form component for adding new products
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface AddProductFormProps {
  categories: Category[];
  onSuccess: () => void;
}

export default function AddProductForm({ categories, onSuccess }: AddProductFormProps) {
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle file upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'pg_id_cards');
    formData.append('folder', 'ecommerce-products');

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dngy2hxmv/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setImages(prev => [...prev, data.secure_url]);
      } else {
        alert('Upload failed: ' + data.error?.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          uploadToCloudinary(file);
        }
      });
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');

      // Make API call to backend
      const response = await fetch('http://localhost:4000/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          images,
          stock: parseInt(stock),
          categoryId: parseInt(categoryId),
        }),
      });

      if (response.ok) {
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setImages([]);
        setStock('');
        setCategoryId('');

        // Call success callback
        onSuccess();
      } else {
        const data = await response.json();
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Premium Headphones"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
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

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="e.g., 99.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            placeholder="e.g., 50"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        {/* Images */}
        <div className="space-y-2 md:col-span-2">
          <Label>Product Images * (At least 3 required)</Label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-500">
            Select multiple images to upload. They will be automatically uploaded.
          </p>
          
          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {images.length < 3 && (
            <p className="text-sm text-red-500">Please upload at least 3 images</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Enter product description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={loading || images.length < 3} className="w-full">
        {loading ? 'Adding Product...' : 'Add Product'}
      </Button>
    </form>
  );
}
