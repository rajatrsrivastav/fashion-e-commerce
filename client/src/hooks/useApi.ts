import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export interface Product {
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

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: Product;
}

// Products Queries
export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const url = category
        ? `/products?category=${encodeURIComponent(category)}`
        : "/products";
      const response = await api.get(url);
      return response.data.products || response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useProduct = (id: string | number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data.product || response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data.categories || response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Cart Queries
export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Not authenticated');

      const response = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.cartItems || [];
    },
    staleTime: 1000 * 30, // 30 seconds
    enabled: !!localStorage.getItem('userToken'),
  });
};

// Cart Mutations
export const useAddToCart = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Not authenticated');

      const response = await api.post("/cart", { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
      });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Not authenticated');

      const response = await api.put(`/cart/${productId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Not authenticated');

      const response = await api.delete(`/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Wishlist Queries
export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Not authenticated');

      const response = await api.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.wishlist || response.data;
    },
    staleTime: 1000 * 60, // 1 minute
    enabled: !!localStorage.getItem('userToken'),
  });
};

export const useWishlistStatus = (productId: number) => {
  return useQuery({
    queryKey: ["wishlist", "status", productId],
    queryFn: async () => {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Not authenticated');

      const response = await api.get(`/wishlist/${productId}/check`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    staleTime: 1000 * 30, // 30 seconds
    enabled: !!localStorage.getItem('userToken') && !!productId,
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Not authenticated');

      const response = await api.put(`/wishlist/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist", "status", productId] });
    },
  });
};