import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChevronRight,
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Edit2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

// Product images
const img1 = "/oversized_sage_green_tee-MEXFQ9d8.png";
const img2 = "/oversized_black_graphic_tee-CoBCJBRr.png";
const img3 = "/oversized_maroon_tee-298jHmWi.png";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, token, isAuthenticated, isLoading: authLoading, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Fetch user profile
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4000/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return response.json();
    },
    enabled: isAuthenticated && !!token,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your profile.",
        variant: "destructive",
      });
      setLocation('/login');
    }
  }, [isAuthenticated, authLoading, setLocation, toast]);

  // Update edit form when user data loads
  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });
    }
  }, [userData]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    setLocation('/');
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      refetch(); // Refresh the profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load profile. Please try again.</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">No profile data available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">My Profile</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-xl">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : (userData.email ? userData.email.charAt(0).toUpperCase() : 'U')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{userData.name || 'User'}</h2>
                <p className="text-gray-500 text-sm">{userData.email}</p>
                <Badge variant="secondary" className="mt-2">
                  Member since {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Badge>
              </div>

              <nav className="space-y-2">
                <NavItem icon={User} label="Profile" active />
                <NavItem icon={Package} label="Orders" href="/orders" />
                <NavItem icon={Heart} label="Wishlist" href="/wishlist" />
                <NavItem icon={MapPin} label="Addresses" />
                <NavItem icon={CreditCard} label="Payment Methods" />
                <NavItem icon={Settings} label="Settings" />
                <Separator className="my-4" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-white border">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Personal Information</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="mt-1" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="mt-1" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            value={editForm.phone}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            className="mt-1" 
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                          <p className="mt-1 text-lg">{userData.name || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                          <p className="mt-1 text-lg">{userData.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                          <p className="mt-1 text-lg">{userData.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                          <p className="mt-1 text-lg">{new Date(userData.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Saved Addresses</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                  <p className="text-gray-500 text-center py-8">No addresses saved yet.</p>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Security Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Password</Label>
                      <p className="mt-1 text-lg">••••••••</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

// NavItem component
function NavItem({ icon: Icon, label, active, href }: { 
  icon: any; 
  label: string; 
  active?: boolean; 
  href?: string; 
}) {
  const content = (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      active ? 'bg-black text-white' : 'hover:bg-gray-50'
    }`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
