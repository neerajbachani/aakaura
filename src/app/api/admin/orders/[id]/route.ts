import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/middleware/auth";
import { createShiprocketOrder } from "@/lib/shiprocket";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const adminUser = await verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            },
            variation: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });

  } catch (error) {
    console.error("Order detail API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const adminUser = await verifyAdminToken(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, trackingNumber, adminNotes, paymentStatus } = body;

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      
      // Set timestamps based on status
      const now = new Date();
      switch (status) {
        case "CONFIRMED":
          updateData.confirmedAt = now;
          break;
        case "SHIPPED":
          updateData.shippedAt = now;
          break;
        case "DELIVERED":
          updateData.deliveredAt = now;
          break;
        case "CANCELLED":
          updateData.cancelledAt = now;
          break;
      }
    }
    
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            },
            variation: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // If order was marked as CONFIRMED, create the Shiprocket order
    if (status === "CONFIRMED" && !updatedOrder.shiprocketOrderId) {
      try {
        const shiprocketResponse = await createShiprocketOrder(updatedOrder as any);
        
        if (shiprocketResponse?.order_id || shiprocketResponse?.shipment_id) {
          const finalOrder = await prisma.order.update({
            where: { id },
            data: {
              shiprocketOrderId: shiprocketResponse.order_id ? String(shiprocketResponse.order_id) : null,
              shiprocketShipmentId: shiprocketResponse.shipment_id ? String(shiprocketResponse.shipment_id) : null,
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              },
              items: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      images: true
                    }
                  },
                  variation: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          });
          return NextResponse.json({ order: finalOrder, shiprocketMessage: "Order successfully pushed to Shiprocket." });
        }
      } catch (shiprocketError: any) {
        console.error("Failed to push to Shiprocket:", shiprocketError);
        return NextResponse.json(
          { order: updatedOrder, warning: `Order confirmed but failed to sync to Shiprocket: ${shiprocketError.message}` }
        );
      }
    }

    return NextResponse.json({ order: updatedOrder });

  } catch (error) {
    console.error("Order update API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}