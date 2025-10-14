import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';

export function PaymentsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Payments page - to be implemented</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentsPage;
