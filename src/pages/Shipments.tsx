
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck } from 'lucide-react';

const Shipments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
        <p className="text-muted-foreground">
          Track shipments and delivery status
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipment Tracking
          </CardTitle>
          <CardDescription>
            Coming soon - Shipment tracking and logistics management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Shipment tracking features will be implemented in the next phase.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shipments;
