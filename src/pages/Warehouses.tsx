
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Plus, Search, Edit, Trash2, Warehouse, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WarehouseData {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  manager_name: string | null;
  phone: string | null;
  email: string | null;
  total_capacity: number | null;
  used_capacity: number | null;
  created_at: string;
}

const Warehouses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
    manager_name: '',
    phone: '',
    email: '',
    total_capacity: '',
    used_capacity: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: warehouses, isLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as WarehouseData[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const submitData = {
        ...data,
        total_capacity: data.total_capacity ? parseFloat(data.total_capacity) : null,
        used_capacity: data.used_capacity ? parseFloat(data.used_capacity) : 0
      };
      const { error } = await supabase
        .from('warehouses')
        .insert([submitData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Warehouse created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create warehouse.',
        variant: 'destructive',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const submitData = {
        ...data,
        total_capacity: data.total_capacity ? parseFloat(data.total_capacity) : null,
        used_capacity: data.used_capacity ? parseFloat(data.used_capacity) : 0
      };
      const { error } = await supabase
        .from('warehouses')
        .update(submitData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      setIsDialogOpen(false);
      resetForm();
      setEditingWarehouse(null);
      toast({
        title: 'Success',
        description: 'Warehouse updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update warehouse.',
        variant: 'destructive',
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('warehouses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({
        title: 'Success',
        description: 'Warehouse deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete warehouse.',
        variant: 'destructive',
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'US',
      manager_name: '',
      phone: '',
      email: '',
      total_capacity: '',
      used_capacity: ''
    });
  };

  const handleEdit = (warehouse: WarehouseData) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      address: warehouse.address || '',
      city: warehouse.city || '',
      state: warehouse.state || '',
      zip_code: warehouse.zip_code || '',
      country: warehouse.country || 'US',
      manager_name: warehouse.manager_name || '',
      phone: warehouse.phone || '',
      email: warehouse.email || '',
      total_capacity: warehouse.total_capacity?.toString() || '',
      used_capacity: warehouse.used_capacity?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWarehouse) {
      updateMutation.mutate({ id: editingWarehouse.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getCapacityPercentage = (used: number | null, total: number | null) => {
    if (!used || !total || total === 0) return 0;
    return Math.min((used / total) * 100, 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredWarehouses = warehouses?.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.city?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">
            Multi-location inventory management and capacity tracking
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingWarehouse(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
              </DialogTitle>
              <DialogDescription>
                {editingWarehouse ? 'Update warehouse information.' : 'Add a new warehouse location.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Warehouse Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Management Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager_name">Manager Name</Label>
                    <Input
                      id="manager_name"
                      value={formData.manager_name}
                      onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Capacity Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total_capacity">Total Capacity (sq ft)</Label>
                    <Input
                      id="total_capacity"
                      type="number"
                      step="0.01"
                      value={formData.total_capacity}
                      onChange={(e) => setFormData({ ...formData, total_capacity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="used_capacity">Used Capacity (sq ft)</Label>
                    <Input
                      id="used_capacity"
                      type="number"
                      step="0.01"
                      value={formData.used_capacity}
                      onChange={(e) => setFormData({ ...formData, used_capacity: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingWarehouse ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map((warehouse) => {
          const capacityPercentage = getCapacityPercentage(warehouse.used_capacity, warehouse.total_capacity);
          return (
            <Card key={warehouse.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Warehouse className="h-5 w-5" />
                  {warehouse.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {[warehouse.city, warehouse.state].filter(Boolean).join(', ') || 'Location not specified'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Capacity Usage</span>
                    <span>{capacityPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={capacityPercentage} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    {warehouse.used_capacity || 0} / {warehouse.total_capacity || 0} sq ft
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div><strong>Manager:</strong> {warehouse.manager_name || 'Not assigned'}</div>
                  <div><strong>Phone:</strong> {warehouse.phone || 'Not provided'}</div>
                  <div><strong>Email:</strong> {warehouse.email || 'Not provided'}</div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(warehouse)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(warehouse.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredWarehouses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Warehouse className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No warehouses found</h3>
            <p className="text-muted-foreground">Add your first warehouse to get started with inventory management.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Search Warehouses</CardTitle>
          <CardDescription>
            Find warehouses by name, manager, or location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search warehouses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Warehouses;
