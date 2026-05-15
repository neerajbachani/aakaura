import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Webhook handler for Shiprocket tracking updates.
 * Shiprocket sends POST requests to this endpoint when a shipment status changes.
 */
export async function POST(request: NextRequest) {
  try {
    // You should consider adding a webhook secret in shiprocket header to verify the request
    // const authHeader = request.headers.get("x-api-key");
    // if (authHeader !== process.env.SHIPROCKET_WEBHOOK_SECRET) { ... }

    const body = await request.json();

    // Shiprocket Webhook payload usually includes:
    // current_status, awb, order_id
    const { awb, current_status, order_id } = body;

    if (!awb || !current_status || !order_id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Find the order using either our orderNumber or shiprocketOrderId
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: order_id },
          { shiprocketOrderId: String(order_id) }
        ]
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Map Shiprocket status to our OrderStatus
    // Shiprocket statuses: 'PICKUP SCHEDULED', 'SHIPPED', 'IN TRANSIT', 'DELIVERED', 'RTO INITIATED', 'RTO DELIVERED', 'CANCELED'
    let newStatus = order.status;
    
    switch (current_status.toUpperCase()) {
      case "SHIPPED":
      case "IN TRANSIT":
      case "OUT FOR DELIVERY":
        newStatus = "SHIPPED";
        break;
      case "DELIVERED":
        newStatus = "DELIVERED";
        break;
      case "CANCELED":
      case "CANCELLED":
        newStatus = "CANCELLED";
        break;
      case "RTO DELIVERED":
      case "RTO INITIATED":
        newStatus = "REFUNDED"; // Or you can add an RTO status in prisma schema
        break;
    }

    const updateData: any = {
      trackingNumber: awb,
    };

    if (newStatus !== order.status) {
      updateData.status = newStatus;
      
      const now = new Date();
      if (newStatus === "SHIPPED" && !order.shippedAt) updateData.shippedAt = now;
      if (newStatus === "DELIVERED" && !order.deliveredAt) updateData.deliveredAt = now;
      if (newStatus === "CANCELLED" && !order.cancelledAt) updateData.cancelledAt = now;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: updateData
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Shiprocket webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
