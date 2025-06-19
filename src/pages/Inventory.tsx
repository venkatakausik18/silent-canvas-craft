
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Warehouse } from 'lucide-react';

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">
          Track stock levels across all warehouse locations
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Inventory Management
          </CardTitle>
          <CardDescription>
            Coming soon - Advanced inventory tracking and management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Inventory management features will be implemented in the next phase.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
